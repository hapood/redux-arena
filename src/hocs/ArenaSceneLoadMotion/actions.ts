import { ARENA_SCENE_SET_STATE } from "../../actionTypes";
import {
  ARENA_SCENE_ANIMATION_NEXTPHRASE,
  ARENA_SCENE_ANIMATION_LEAVING_START,
  ARENA_SCENE_ANIMATION_LOAD_BUNDLE
} from "./actionTypes";
export function setState(state) {
  return {
    type: ARENA_SCENE_SET_STATE,
    state
  };
}

export function nextPhase(phase) {
  return {
    type: ARENA_SCENE_ANIMATION_NEXTPHRASE,
    phase
  };
}

export function startLeaving() {
  return {
    type: ARENA_SCENE_ANIMATION_LEAVING_START
  };
}

export function loadSceneBundle(asyncBundleThunk) {
  return {
    type: ARENA_SCENE_ANIMATION_LOAD_BUNDLE,
    asyncBundleThunk
  };
}
