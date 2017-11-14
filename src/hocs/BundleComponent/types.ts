import { ActionCreatorsMapObject } from "redux";
import {
  CurtainLoadSceneAction,
  CurtainState,
  ReducerDict,
  SceneBundle
} from "../../core";

export type State = {
  loadedPromise: Promise<null>;
};

export type BaseProps = CurtainState<{}> & {
  clearCurtain: () => void;
};

export type ConnectedProps = BaseProps &
  Props & {
    curtainLoadScene: CurtainLoadScene<{}, {}, {}, {}>;
  };

export type Props = {
  arenaReducerDict: ReducerDict;
  sceneBundle: SceneBundle<{}, {}, {}, {}>;
  sceneProps: any;
};

export type CurtainLoadScene<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
> = (
  arenaReducerDict: ReducerDict,
  sceneBundle: SceneBundle<P, S, A, PP>,
  isInitial: any,
  loadedCb: () => void
) => CurtainLoadSceneAction<P, S, A, PP>;
