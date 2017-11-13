import ActionTypes from "./ActionTypes";

function addCnt() {
  return {
    type: ActionTypes.ADD_CNT
  };
}

function clearCnt() {
  return {
    type: ActionTypes.FRAME_CLEAR_CNT
  };
}

export default { addCnt, clearCnt };
