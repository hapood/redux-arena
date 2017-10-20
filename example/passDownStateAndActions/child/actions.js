import { ARENA_SCENE_SET_STATE } from "redux-arena/ActionTypes";

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
