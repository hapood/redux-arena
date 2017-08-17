import { takeLatest, put } from "redux-saga/effects";

import { FRAME_HISTORY_PUSH } from "./actionTypes";

function* historyPush({ path, isTracing }) {
  let { history } = yield select(state => state.arena);
  if (history) {
    if (isTracing) {
      let { arena, scene } = yield select(state => state);
      let { match, location, tracks } = arena;
      yield put({
        type: FRAME_SET_STATE,
        tracks: tracks.concat({ match, location, scene })
      });
    } else {
      yield put({
        type: FRAME_SET_STATE,
        tracks: []
      });
    }
    history.push(path);
  } else {
    console.warn("History is not initaialized yet");
  }
}

export default function* saga() {
  yield takeLatest(FRAME_HISTORY_PUSH, historyPush);
}
