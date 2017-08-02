import {
  SCENE_SET_STATE,
  SCENE_REPLACE_STATE,
  SCENE_SET_REND
} from "../actionTypes.js";
import getSceneInitState from "./getSceneInitState";

export default function reducer(state = getSceneInitState(), action) {
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
