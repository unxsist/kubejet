// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    io::{BufRead, BufReader, Write},
    sync::{Arc, Mutex},
    thread::{self, sleep},
    time::Duration,
};
use std::collections::HashMap;
use k8s_openapi::api::apps::v1::Deployment;
use kube::{Client, api::{Api}, Error, Config};
use k8s_openapi::api::core::v1::{Namespace, Pod};
use kube::api::{ListParams};
use kube::config::{Kubeconfig, KubeconfigError, KubeConfigOptions};
use serde::{Serialize};
use portable_pty::{native_pty_system, CommandBuilder, PtyPair, PtySize};
use tauri::{async_runtime::Mutex as AsyncMutex, Manager, State};

#[derive(Debug, Serialize)]
struct SerializableKubeError {
    message: String,
    code: Option<u16>,
    reason: Option<String>,
    details: Option<String>,
}

impl From<Error> for SerializableKubeError {
    fn from(error: Error) -> Self {
        match error {
            Error::Api(api_error) => {
                let code = api_error.code;
                let reason = api_error.reason;
                let message = api_error.message;
                return SerializableKubeError {
                    message,
                    code: Option::from(code),
                    reason: Option::from(reason),
                    details: None,
                };
            }
            _ => {
                return SerializableKubeError {
                    message: error.to_string(),
                    code: None,
                    reason: None,
                    details: None,
                };
            }
        }
    }
}

impl From<KubeconfigError> for SerializableKubeError {
    fn from(error: KubeconfigError) -> Self {
        return SerializableKubeError {
            message: error.to_string(),
            code: None,
            reason: None,
            details: None,
        };
    }
}

static CURRENT_CONTEXT: Mutex<Option<String>> = Mutex::new(Some(String::new()));
static CLIENT: Mutex<Option<Client>> = Mutex::new(None);

#[tauri::command]
async fn get_current_context() -> Result<String, SerializableKubeError> {
    let config = Kubeconfig::read().map_err(|err| SerializableKubeError::from(err))?;

    return Ok(config.current_context.expect("No current context"));
}

#[tauri::command]
async fn list_contexts() -> Result<Vec<String>, SerializableKubeError> {
    let config = Kubeconfig::read().map_err(|err| SerializableKubeError::from(err))?;

    config.contexts.iter().map(|context| {
        let name = context.name.clone();
        return Ok(name);
    }).collect()
}

async fn client_with_context(context: &str) -> Result<Client, SerializableKubeError> {
    if context.to_string() != CURRENT_CONTEXT.lock().unwrap().as_ref().unwrap().clone() {
        println!("client_with_context - context changed from {} to {}", CURRENT_CONTEXT.lock().unwrap().as_ref().unwrap().clone(), context);
        let options = KubeConfigOptions {
            context: Some(context.to_string()),
            cluster: None,
            user: None,
        };

        let client_config = Config::from_kubeconfig(&options).await.map_err(|err| SerializableKubeError::from(err))?;
        let client = Client::try_from(client_config).map_err(|err| SerializableKubeError::from(err))?;

        CURRENT_CONTEXT.lock().unwrap().replace(context.to_string());
        CLIENT.lock().unwrap().replace(client);
    }

    return Ok(CLIENT.lock().unwrap().clone().unwrap());
}

#[tauri::command]
async fn list_namespaces(context: &str) -> Result<Vec<Namespace>, SerializableKubeError> {
    let client = client_with_context(context).await?;
    let namespace_api: Api<Namespace> = Api::all(client);

    return namespace_api.list(&ListParams::default()).await.map(|namespaces | namespaces.items).map_err(|err| SerializableKubeError::from(err));
}

#[tauri::command]
async fn list_pods(context: &str, namespace: &str) -> Result<Vec<Pod>, SerializableKubeError> {
    let client = client_with_context(context).await?;
    let pod_api: Api<Pod> = Api::namespaced(client, namespace);

    return pod_api.list(&ListParams::default()).await.map(|pods| pods.items).map_err(|err| SerializableKubeError::from(err));
}

#[tauri::command]
async fn list_deployments(context: &str, namespace: &str) -> Result<Vec<Deployment>, SerializableKubeError> {
    let client = client_with_context(context).await?;
    let deployment_api: Api<Deployment> = Api::namespaced(client, namespace);

    return deployment_api.list(&ListParams::default()).await.map(|deployments| deployments.items).map_err(|err| SerializableKubeError::from(err));
}

struct TerminalSession {
    pty_pair: PtyPair,
    writer: Arc<Mutex<Box<dyn Write + Send>>>,
}

static TTY_SESSIONS: Mutex<Option<HashMap<String, TerminalSession>>> = Mutex::new(None);

#[tauri::command]
fn create_tty_session(app_handle: tauri::AppHandle) -> String {
    if TTY_SESSIONS.lock().unwrap().is_none() {
        TTY_SESSIONS.lock().unwrap().replace(HashMap::new());
    }

    let pty_system = native_pty_system();
    let pty_pair = pty_system.openpty(PtySize {
        rows: 24,
        cols: 80,
        pixel_width: 0,
        pixel_height: 0,
    }).unwrap();

    #[cfg(target_os = "windows")]
    let cmd = CommandBuilder::new("powershell.exe");
    #[cfg(not(target_os = "windows"))]
    let cmd = CommandBuilder::new("bash");

    let mut child = pty_pair.slave.spawn_command(cmd).unwrap();
    thread::spawn(move || {
        child.wait().unwrap();
    });

    let reader = pty_pair.master.try_clone_reader().unwrap();
    let reader = Arc::new(Mutex::new(Some(BufReader::new(reader))));

    let session_id = "test".to_string();
    let thread_session_id = session_id.clone();

    thread::spawn(move || {
        let reader = reader.lock().unwrap().take();
        let app = app_handle.clone();
        let session_id = thread_session_id.clone();
        if let Some(mut reader) = reader {
            loop {
                sleep(Duration::from_millis(1));
                let data = reader.fill_buf().unwrap().to_vec();
                reader.consume(data.len());
                if data.len() > 0 {
                    app.emit_all(format!("tty_data_{}", session_id).as_ref(), data).unwrap();
                }
            }
        }
    });

    let writer = pty_pair.master.take_writer().unwrap();
    TTY_SESSIONS.lock().unwrap().as_mut().unwrap().insert(session_id.clone(), TerminalSession {
        pty_pair,
        writer: Arc::new(Mutex::new(writer)),
    });

    return session_id
}

#[tauri::command]
fn write_to_pty(session_id: &str, data: &str) {
    // First, lock the sessions map
    let sessions_lock = TTY_SESSIONS.lock().unwrap();

    // Then, try to get the session from the map
    if let Some(sessions) = sessions_lock.as_ref() {
        if let Some(session) = sessions.get(session_id) {
            // Lock the writer
            let mut writer_guard = session.writer.lock().unwrap();
            // Attempt to write and handle any error
            if let Err(_) = write!(&mut *writer_guard, "{}", data) {
                // Handle the error from the write! macro here
            }
        } else {
            // Handle the case when the session is not found
        }
    } else {
        // Handle the case when the TTY_SESSIONS map is not initialized
    }

}

// #[tauri::command]
// async fn async_write_to_pty(data: &str, state: State<'_, TerminalState>) -> Result<(), ()> {
//     write!(state.writer.lock().await, "{}", data).map_err(|_| ())
// }

fn main() {
    let _ = fix_path_env::fix();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_contexts, get_current_context, list_namespaces, list_pods, list_deployments, create_tty_session, write_to_pty])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
