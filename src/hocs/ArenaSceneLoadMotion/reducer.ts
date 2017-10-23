import initState from "./state";
import ActionTypes from "./ActionTypes";
import AnimationPhases from "./AnimationPhases";
import { State } from "./types";
import { AnyAction } from "redux";

export default function(
  state: State = initState,
  action: AnyAction,
  sceneReducerKey: string
) {
  if (action._sceneReducerKey !== sceneReducerKey) return state;
  switch (action.type) {
    case ActionTypes.ARENA_SCENE_ANIMATION_NEXTPHRASE:
      if (state.phase !== action.phase) return state;
      switch (state.phase) {
        case AnimationPhases.LOADING:
          return Object.assign({}, state, {
            phase: AnimationPhases.ENTERING
          });
        case AnimationPhases.ENTERING:
          return Object.assign({}, state, {
            phase: AnimationPhases.IN
          });
        case AnimationPhases.LEAVING:
          return Object.assign({}, state, { phase: AnimationPhases.OUT });
        default:
          return state;
      }
    case ActionTypes.ARENA_SCENE_ANIMATION_LEAVING_START:
      if (state.phase === AnimationPhases.IN)
        return Object.assign({}, state, { phase: AnimationPhases.LEAVING });
    default:
      return state;
  }
}
