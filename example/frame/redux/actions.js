import ActionTypes from "./ActionTypes";

export function addCnt() {
  return {
    type: ActionTypes.ADD_CNT
  };
}

export function clearCnt() {
  return {
    type: ActionTypes.FRAME_CLEAR_CNT
  };
}
