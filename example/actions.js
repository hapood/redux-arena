import { ARENA_HISTORY_PUSH } from "../src/redux/actionTypes";

export function jumpTo(path, isTracing) {
  return {
    type: ARENA_HISTORY_PUSH,
    path,
    isTracing
  };
}
