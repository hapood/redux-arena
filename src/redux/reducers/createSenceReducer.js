import {
  SCENE_SET_STATE,
  SCENE_REPLACE_STATE,
  SCENE_SET_REND
} from "../actionTypes.js";
import getSceneInitState from "./getSceneInitState";

function reducer(state = getSceneInitState(), action, sceneReducerKey) {
  if (action._sceneReducerKey !== sceneReducerKey) return state;
  switch (action.type) {
    case SCENE_SET_STATE:
      return Object.assign({}, state, action.state);
    case SCENE_REPLACE_STATE:
      return Object.assign({}, action.state);
    case SCENE_SET_REND:
      return action.state;
    default:
      return state;
  }
}

export default function createSenceReducer(extendSenceReducer, sceneReducerKey) {
  return function (state, action) {
    if (extendSenceReducer) {
      state = extendSenceReducer(state, action, sceneReducerKey);
    }
    return reducer(state, action, sceneReducerKey);
  };
}
