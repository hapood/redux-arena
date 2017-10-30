import { CurtainLoadScene } from "./actions";
import { CurtainState, ReducerDict, SceneBundle } from "../../core";

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
  sceneBundle: SceneBundle;
  sceneProps: any;
};
