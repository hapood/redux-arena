import { ARENA_SCENE_SET_STATE } from "redux-arena/actionTypes";

export function addCnt() {
  return {
    type: "ADD_CNT"
  };
}

export function clearCnt() {
  return {
    type: ARENA_SCENE_SET_STATE,
    state: {
      cnt: 0
    }
  };
}


export function switchDynamicState(flag) {
  return { type: "SWITCH_DYNAMIC_STATE", flag };
}
