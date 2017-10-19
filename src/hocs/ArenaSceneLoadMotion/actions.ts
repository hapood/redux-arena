import ArenaActionTypes from "../../ActionTypes";
import ActionTypes from "./ActionTypes";
import AnimationPhase from "./AnimationPhase";
import { State } from "./state";
export function setState(state: State) {
  return {
    type: ArenaActionTypes.ARENA_SCENE_SET_STATE,
    state
  };
}

export function nextPhase(phase: AnimationPhase) {
  return {
    type: ActionTypes.ARENA_SCENE_ANIMATION_NEXTPHRASE,
    phase
  };
}

export function startLeaving() {
  return {
    type: ActionTypes.ARENA_SCENE_ANIMATION_LEAVING_START
  };
}

export function loadSceneBundle(asyncBundleThunk: () => Promise<{}>) {
  return {
    type: ActionTypes.ARENA_SCENE_ANIMATION_LOAD_BUNDLE,
    asyncBundleThunk
  };
}
