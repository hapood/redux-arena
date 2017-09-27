import { ARENA_SCENE_SET_STATE } from "redux-arena/actionTypes";
import {
  ARENA_SCENE_ANIMATION_NEXTPHRASE,
  ARENA_SCENE_ANIMATION_LEAVING_START
} from "./actionType";

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
