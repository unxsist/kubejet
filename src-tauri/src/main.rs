// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use k8s_openapi::api::apps::v1::Deployment;
use kube::{Client, api::{Api}, Error, Config};
use k8s_openapi::api::core::v1::{Namespace, Pod};
use kube::api::{ListParams};
use kube::config::{Kubeconfig, KubeconfigError, KubeConfigOptions};
use serde::{Serialize};

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


fn main() {
    let _ = fix_path_env::fix();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_contexts, get_current_context, list_namespaces, list_pods, list_deployments])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
