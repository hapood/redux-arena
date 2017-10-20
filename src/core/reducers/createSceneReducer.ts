import { AnyAction } from "redux";
import ActionTypes from "../ActionTypes";
import getSceneInitState from "./getSceneInitState";
import { SceneReducer } from "../types";

function sceneReducer(
  state = getSceneInitState(),
  action: AnyAction,
  sceneReducerKey: string
) {
  if (action._sceneReducerKey !== sceneReducerKey) return state;
  switch (action.type) {
    case ActionTypes.ARENA_SCENE_SET_STATE:
      return Object.assign({}, state, action.state);
    case ActionTypes.ARENA_SCENE_REPLACE_STATE:
      return Object.assign({}, action.state);
    default:
      return state;
  }
}

export default function createSceneReducer(
  extendSceneReducer: SceneReducer<any> | null | undefined,
  initState: any,
  sceneReducerKey: string
) {
  return function(state = initState, action: AnyAction) {
    if (extendSceneReducer) {
      state = extendSceneReducer(state, action, sceneReducerKey);
    }
    return sceneReducer(state, action, sceneReducerKey);
  };
}
