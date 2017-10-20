import AnimationPhase from "./AnimationPhase";
import { State } from "./types";

export default {
  isSceneReady: false,
  phase: AnimationPhase.LOADING,
  bundle: null,
  initStyles: null
} as State;
