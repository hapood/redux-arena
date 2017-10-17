import { takeLatest, fork, put, CallEffectFactory } from "redux-saga/effects";
import { Action } from "redux";
import { ARENA_INIT_AUDIENCE_SAGA, ARENA_SET_STATE } from "../actionTypes";

/**
 *This function is run at the beginning of the incoming saga, and then saved in the arena
 * 
 * @param {any} { saga } 
 */

interface InitAudienceAction extends Action {
  saga: Iterator<any>;
}

function* initAudienceSaga({ saga: CallEffectFactory }: InitAudienceAction) {
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
