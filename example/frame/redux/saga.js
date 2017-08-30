import { takeLatest, put } from "redux-saga/effects";

import { FRAME_CLEAR_CNT, FRAME_SET_STATE } from "./actionTypes";

function* clearCnt() {
  yield put({
    type: FRAME_SET_STATE,
    state: { cnt: 0 }
  });
}

export default function* saga() {
  yield takeLatest(FRAME_CLEAR_CNT, clearCnt);
}
