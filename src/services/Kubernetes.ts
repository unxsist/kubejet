import { V1Deployment, V1Namespace, V1Pod } from "@kubernetes/client-node";
import { invoke } from "@tauri-apps/api/tauri";

export class Kubernetes {
  static async getCurrentContext(): Promise<string> {
    return invoke("get_current_context", {});
  }

  static async getContexts(): Promise<string[]> {
    return invoke("list_contexts", {});
  }

  static async getNamespaces(context: string): Promise<V1Namespace[]> {
    return invoke("list_namespaces", { context: context });
  }

  static async getPods(context: string, namespace: string): Promise<V1Pod[]> {
    return invoke("list_pods", { context: context, namespace: namespace });
  }

  static async getDeployments(
    context: string,
    namespace: string,
  ): Promise<V1Deployment[]> {
    return invoke("list_deployments", {
      context: context,
      namespace: namespace,
    });
  }
}
