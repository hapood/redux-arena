import {
  SCENESWITCH_SET_STATE,
  SCENESWITCH_REPLACE_STATE
} from "../actionTypes.js";
import getSceneSwitchInitState from "./getSceneSwitchInitState";

function senceSwitchReducer(state, action) {
  switch (action.type) {
    case SCENESWITCH_SET_STATE:
      return Object.assign({}, state, action.state);
    case SCENESWITCH_REPLACE_STATE:
      return Object.assign({}, action.state);
    default:
      return state;
  }
}

export default function createSenceSwitchReducer(sceneSwitchKey) {
  return function(state = getSceneSwitchInitState(), action) {
    if (sceneSwitchKey === action.sceneSwitchKey) {
      state = senceSwitchReducer(state, action);
    }
    return state;
  };
}
