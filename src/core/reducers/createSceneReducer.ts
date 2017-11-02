import { AnyAction } from "redux";
import ActionTypes from "../ActionTypes";
import getSceneInitState from "./getSceneInitState";
import { SceneReducer } from "../types";

function sceneReducer(state = getSceneInitState(), action: AnyAction) {
  switch (action.type) {
    case ActionTypes.ARENA_SCENE_SET_STATE:
      return Object.assign({}, state, action.state);
    case ActionTypes.ARENA_SCENE_REPLACE_STATE:
      return Object.assign({}, action.state);
    default:
      return state;
  }
}

export default function createSceneReducer<S>(
  extendSceneReducer: SceneReducer<S> | null | undefined,
  initState: any,
  sceneReducerKey: string
) {
  return function(state = initState, action: AnyAction) {
    let isSceneAction =
      action._sceneReducerKey && action._sceneReducerKey === sceneReducerKey
        ? true
        : false;
    if (extendSceneReducer) {
      state = extendSceneReducer(state, action, isSceneAction);
    }
    return isSceneAction ? sceneReducer(state, action) : state;
  };
}
