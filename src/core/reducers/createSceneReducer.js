import {
  ARENA_SCENE_SET_STATE,
  ARENA_SCENE_REPLACE_STATE
} from "../actionTypes.js";
import getSceneInitState from "./getSceneInitState";

function sceneReducer(state = getSceneInitState(), action, sceneReducerKey) {
  if (action._sceneReducerKey !== sceneReducerKey) return state;
  switch (action.type) {
    case ARENA_SCENE_SET_STATE:
      return Object.assign({}, state, action.state);
    case ARENA_SCENE_REPLACE_STATE:
      return Object.assign({}, action.state);
    default:
      return state;
  }
}

export default function createSceneReducer(
  extendSceneReducer,
  sceneReducerKey,
  initState
) {
  return function(state = initState, action) {
    if (extendSceneReducer) {
      state = extendSceneReducer(state, action, sceneReducerKey);
    }
    return sceneReducer(state, action, sceneReducerKey);
  };
}
