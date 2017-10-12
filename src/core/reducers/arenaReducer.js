import {
  ARENA_SET_STATE,
  ARENA_REPLACE_STATE,
  ARENA_GLOBAL_PROPSPICKER_LOCK
} from "../actionTypes.js";
import getArenaInitState from "./getArenaInitState";

export default function reducer(state = getArenaInitState(), action) {
  switch (action.type) {
    case ARENA_SET_STATE:
      return Object.assign({}, state, action.state);
    case ARENA_REPLACE_STATE:
      return Object.assign({}, action.state);
    case ARENA_GLOBAL_PROPSPICKER_LOCK:
      return Object.assign({ propsLock: action.lock });
    default:
      return state;
  }
}
