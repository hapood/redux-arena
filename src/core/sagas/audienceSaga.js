import { takeLatest, fork, put } from "redux-saga/effects";

import { ARENA_INIT_AUDIENCE_SAGA, ARENA_SET_STATE } from "../actionTypes";

/**
 *This function is run at the beginning of the incoming saga, and then saved in the arena
 * 
 * @param {any} { saga } 
 */
function* initAudienceSaga({ saga }) {
  let newAudienceSagaTask = yield fork(saga);
  yield put({
    type: ARENA_SET_STATE,
    state: {
      audienceSagaTask: newAudienceSagaTask
    }
  });
}

export default function* saga() {
  yield takeLatest(ARENA_INIT_AUDIENCE_SAGA, initAudienceSaga);
}
