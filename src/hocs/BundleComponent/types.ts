import {
  CurtainLoadSceneAction,
  CurtainState,
  ReducerDict,
  SceneBundle
} from "../../core";

export type State = {
  loadedPromise: Promise<null>;
};

export type BaseProps = CurtainState & {
  clearCurtain: () => void;
};

export type ConnectedProps = BaseProps &
  Props & {
    curtainLoadScene: CurtainLoadScene<any, any, any>;
  };

export type Props = {
  arenaReducerDict: ReducerDict;
  sceneBundle: SceneBundle<{}, {}, {}>;
  sceneProps: any;
};

export type CurtainLoadScene<P, S, PP> = (
  arenaReducerDict: ReducerDict,
  sceneBundle: SceneBundle<P, S, PP>,
  isInitial: any,
  loadedCb: () => void
) => CurtainLoadSceneAction<P, S, PP>;
