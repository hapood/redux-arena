import ActionTypes from "redux-arena/ActionTypes";

function addCnt() {
  return {
    type: "ADD_CNT"
  };
}

function clearCnt() {
  return {
    type: ActionTypes.ARENA_SCENE_SET_STATE,
    state: {
      cnt: 0
    }
  };
}

export default { addCnt, clearCnt };
