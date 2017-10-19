import AnimationPhase from "./AnimationPhase";

export type State = {
  sSceneReady: boolean;
  phase: AnimationPhase;
  bundle: null;
};

export default {
  isSceneReady: false,
  phase: AnimationPhase.LOADING,
  bundle: null
};
