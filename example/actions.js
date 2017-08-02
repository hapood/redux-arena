import { ARENA_HISTORY_PUSH } from "../src/redux/actionTypes";

export function jumpTo(path) {
  return {
    type: ARENA_HISTORY_PUSH,
    path
  };
}
