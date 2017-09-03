import { ARENA_SET_STATE, ARENA_REPLACE_STATE } from "../actionTypes.js";
import getArenaInitState from "./getArenaInitState";

export default function reducer(state = getArenaInitState(), action) {
  switch (action.type) {
    case ARENA_SET_STATE:
      return Object.assign({}, state, action.state);
    case ARENA_REPLACE_STATE:
      return Object.assign({}, action.state);
    default:
      return state;
  }
}
