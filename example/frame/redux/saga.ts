import { takeLatest, put } from "redux-saga/effects";

import ActionTypes from "./ActionTypes";

function* clearCnt() {
  yield put({
    type: ActionTypes.FRAME_SET_STATE,
    state: { cnt: 0 }
  });
}

export default function* saga() {
  yield takeLatest(ActionTypes.FRAME_CLEAR_CNT, clearCnt);
}
