import { takeLatest, select } from "redux-saga/effects";

import { GO_TO_URL } from "./actionTypes";

function* historyPush({ url }) {
  let { history } = yield select(state => state.frame);
  history.push(url);
}

export default function* saga() {
  yield takeLatest(GO_TO_URL, historyPush);
}
