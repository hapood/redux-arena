import { SCENE_SET_STATE } from "redux-arena/actionTypes";

export function addCnt() {
  return {
    type: "ADD_CNT"
  };
}

export function clearCnt() {
  return {
    type: SCENE_SET_STATE,
    state: {
      cnt: 0
    }
  };
}
