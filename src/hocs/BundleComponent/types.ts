import { CurtainLoadScene } from "./actions";
import { CurtainState, ReducerDict, SceneBundle } from "../../core";

export type BundleComponentState = {
  loadedPromise: Promise<null>;
};

export type BundleComponentBaseProps = CurtainState & {
  clearCurtain: () => void;
};

export type BundleComponentConnectedProps = BundleComponentBaseProps &
  BundleComponentProps & {
    curtainLoadScene: CurtainLoadScene<any, any, any>;
  };

export type BundleComponentProps = {
  arenaReducerDict: ReducerDict;
  sceneBundle: SceneBundle;
  sceneProps: any;
};
