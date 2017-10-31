import { EnhancedStore, ReducerDict, SceneBundle } from "../../core";

export type ExtraProps = {
  reducerKey?: string;
  vReducerKey?: string;
};
export type Props = ExtraProps & {
  sceneProps?: {};
  sceneBundle: SceneBundle<{}, {}, {}>;
};

export type State = {
  parentReducerKey: string;
  arenaReducerDict: ReducerDict;
  ConnectedBundleComponent: React.SFC<any>;
  connectedBundleElement: React.SFCElement<any>;
};

export type Context = {
  store: EnhancedStore<any>;
  arenaReducerDict: ReducerDict | null | undefined;
};
