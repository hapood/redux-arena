import {
  ARENA_CURTAIN_SET_STATE,
  ARENA_CURTAIN_REPLACE_STATE
} from "../actionTypes.js";
import getSwitchInitState from "./getSwitchInitState";

function senceSwitchReducer(state, action, arenaSwitchReducerKey) {
  switch (action.type) {
    case ARENA_SWITCH_SET_STATE:
      return Object.assign({}, state, action.state);
    case ARENA_SWITCH_REPLACE_STATE:
      return Object.assign({}, action.state);
    default:
      return state;
  }
}

export default function createArenaSwitchReducer(arenaSwitchReducerKey) {
  return function(state = getSwitchInitState(), action) {
    if (arenaSwitchReducerKey === action.arenaSwitchReducerKey) {
      state = senceSwitchReducer(state, action, arenaSwitchReducerKey);
    }
    return state;
  };
}
