import {
  ARENASWITCH_SET_STATE,
  ARENASWITCH_REPLACE_STATE
} from "../actionTypes.js";
import getArenaSwitchInitState from "./getArenaSwitchInitState";

function senceSwitchReducer(state, action) {
  switch (action.type) {
    case ARENASWITCH_SET_STATE:
      return Object.assign({}, state, action.state);
    case ARENASWITCH_REPLACE_STATE:
      return Object.assign({}, action.state);
    default:
      return state;
  }
}

export default function createArenaSwitchReducer(arenaSwitchKey) {
  return function (state = getArenaSwitchInitState(), action) {
    if (arenaSwitchKey === action.arenaSwitchKey) {
      state = senceSwitchReducer(state, action);
    }
    return state;
  };
}
