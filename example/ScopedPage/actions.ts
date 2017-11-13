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

function switchDynamicState(isEnabled) {
  return { type: "SWITCH_DYNAMIC_STATE", isEnabled };
}

export default { addCnt, clearCnt, switchDynamicState };
