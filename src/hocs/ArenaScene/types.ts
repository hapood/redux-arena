import { EnhancedStore, ReducerDict, SceneBundle } from "../../core";

export type ArenaSceneExtraProps = {
  reducerKey?: string;
  vReducerKey?: string;
};
export type ArenaSceneProps<SP, SS> = ArenaSceneExtraProps & {
  sceneProps?: SP;
  sceneBundle: SceneBundle<SP, SS>;
};

export type ArenaSceneState = {
  parentReducerKey: string;
  arenaReducerDict: ReducerDict;
  ConnectedBundleComponent: React.SFC<any>;
  connectedBundleElement: React.SFCElement<any>;
};

export type ArenaSceneContext = {
  store: EnhancedStore<any>;
  arenaReducerDict: ReducerDict | null | undefined;
};
