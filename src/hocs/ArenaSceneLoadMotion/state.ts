import AnimationPhases from "./AnimationPhases";
import { State } from "./types";

export default {
  isSceneReady: false,
  phase: AnimationPhases.LOADING,
  bundle: null
} as State;
