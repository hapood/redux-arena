import ActionTypes from "redux-arena/ActionTypes";

export function addCnt() {
  return {
    type: "ADD_CNT"
  };
}

export function clearCnt() {
  return {
    type: ActionTypes.ARENA_SCENE_SET_STATE,
    state: {
      cnt: 0
    }
  };
}

export function switchDynamicState(flag) {
  return { type: "SWITCH_DYNAMIC_STATE", flag };
}
