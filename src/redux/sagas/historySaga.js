import { takeLatest, fork, put } from "redux-saga/effects";

import { ARENA_HISTORY_PUSH } from "../actionTypes";

function* historyPush({ path }) {
  let { history } = yield select(state => state.arena);
  if (history) {
    history.push(path);
  } else {
    console.warn("History is not initaialized yet");
  }
}

export default function* saga() {
  yield takeLatest(ARENA_HISTORY_PUSH, historyPush);
}
