import { takeLatest, fork, put, ForkEffect } from "redux-saga/effects";
import { Action } from "redux";
import { actionTypes } from "../actionTypes";

/**
 *This function is run at the beginning of the incoming saga, and then saved in the arena
 * 
 * @param {any} { saga } 
 */

interface InitAudienceAction extends Action {
  saga: () => null;
}

function* initAudienceSaga({ saga }: InitAudienceAction) {
  let newAudienceSagaTask = yield fork(saga);
  yield put({
    type: actionTypes.ARENA_SET_STATE,
    state: {
      audienceSagaTask: newAudienceSagaTask
    }
  });
}

export default function* saga() {
  yield takeLatest(actionTypes.ARENA_INIT_AUDIENCE_SAGA, initAudienceSaga);
}
