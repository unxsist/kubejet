export interface GeneralSettings {
    loadDataWithoutActiveNamespace: boolean;
}

export interface ClusterSettings {
    favoriteNamespaces: string[];
}

export interface RouteSettings {
    drawerWidth: number | null;
}

export interface Settings {
    generalSettings: GeneralSettings;
    clusterSettings: Map<string, ClusterSettings>;
    routeSettings: Map<string, RouteSettings>;
}

export const DefaultSettings: Settings = {
    generalSettings: {
        loadDataWithoutActiveNamespace: false,
    },
    clusterSettings: new Map<string, ClusterSettings>(),
    routeSettings: new Map<string, RouteSettings>(),
}

export const DefaultRouteSettings: RouteSettings = {
    drawerWidth: null
}

export const DefaultClusterSettings: ClusterSettings = {
    favoriteNamespaces: []
}
