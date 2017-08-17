import { FRAME_HISTORY_PUSH } from "./actionTypes";

export function jumpTo(path, isTracing) {
  return {
    type: FRAME_HISTORY_PUSH,
    path,
    isTracing
  };
}
