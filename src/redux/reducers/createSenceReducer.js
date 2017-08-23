import {
  SCENE_SET_STATE,
  SCENE_REPLACE_STATE,
  SCENE_SET_REND
} from "../actionTypes.js";
import getSceneInitState from "./getSceneInitState";

function reducer(state = getSceneInitState(), action, sceneKey) {
  if (action._sceneKey !== sceneKey) return state;
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

export default function createSenceReducer(extendSenceReducer, sceneKey) {
  return function (state, action) {
    if (extendSenceReducer) {
      state = extendSenceReducer(state, action, sceneKey);
    }
    return reducer(state, action, sceneKey);
  };
}
