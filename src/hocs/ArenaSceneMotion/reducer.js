import initState from "./state";
import { ARENA_SCENEBUNDLE_PLAY_START } from "../../actionTypes";
import {
  ARENA_SCENE_ANIMATION_NEXTPHRASE,
  ARENA_SCENE_ANIMATION_LEAVING_START
} from "./actionType";
import { LOADING, ENTERING, IN, LEAVING, OUT } from "./animationPhase";

export default function(state = initState, action, sceneReducerKey) {
  switch (action.type) {
    case ARENA_SCENEBUNDLE_PLAY_START:
      if (sceneReducerKey === action.notifyData._toReducerKey) {
        return Object.assign({}, state, { isSceneReady: true });
      } else {
        return state;
      }
  }
  if (action._sceneReducerKey !== sceneReducerKey) return state;
  switch (action.type) {
    case ARENA_SWITCH_ANIMATION_NEXTPHRASE:
      if (state.phase !== phase) return state;
      switch (state.phase) {
        case LOADING:
          return Object.assign({}, state, {
            phase: ENTERING
          });
        case ENTERING:
          return Object.assign({}, state, {
            phase: IN
          });
        case LEAVING:
          return Object.assign({}, state, { phase: OUT });
        case ARENA_SCENE_ANIMATION_LEAVING_START:
          if (state.phase === IN)
            return Object.assign({}, state, { phase: LEAVING });
        default:
          return state;
      }
    default:
      return state;
  }
}
