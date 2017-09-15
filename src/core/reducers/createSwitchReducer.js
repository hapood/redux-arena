import {
  ARENA_SWITCH_SET_STATE,
  ARENA_SWITCH_REPLACE_STATE
} from "../actionTypes.js";
import getSwitchInitState from "./getSwitchInitState";

function switchReducer(state, action, boundReducerKey) {
  switch (action.type) {
    case ARENA_SWITCH_SET_STATE:
      return Object.assign({}, state, action.state);
    case ARENA_SWITCH_REPLACE_STATE:
      return Object.assign({}, action.state);
    default:
      return state;
  }
}

export default function createSwitchReducer(boundReducerKey) {
  return function(state = getSwitchInitState(), action) {
    if (boundReducerKey === action._reducerKey) {
      state = switchReducer(state, action, boundReducerKey);
    }
    return state;
  };
}
