export interface GeneralSettings {
  loadDataWithoutActiveNamespace: boolean;
  useLastActiveContextAndNamespace: boolean;
}

export interface ActiveContextSettings {
  currentContext: string;
  currentNamespace: string;
}

export interface ClusterSettings {
  favoriteNamespaces: string[];
}

export interface RouteSettings {
  drawerWidth: number | null;
}

export interface Settings {
  generalSettings: GeneralSettings;
  activeContextSettings: ActiveContextSettings;
  clusterSettings: Map<string, ClusterSettings>;
  routeSettings: Map<string, RouteSettings>;
}

export const DefaultSettings: Settings = {
  generalSettings: {
    loadDataWithoutActiveNamespace: false,
    useLastActiveContextAndNamespace: true,
  },
  activeContextSettings: {
    currentContext: "",
    currentNamespace: "",
  },
  clusterSettings: new Map<string, ClusterSettings>(),
  routeSettings: new Map<string, RouteSettings>(),
};

export const DefaultRouteSettings: RouteSettings = {
  drawerWidth: null,
};

export const DefaultClusterSettings: ClusterSettings = {
  favoriteNamespaces: [],
};
