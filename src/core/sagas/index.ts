/* eslint-disable no-constant-condition */
import {
  fork,
  all,
  setContext,
  AllEffect,
  SetContextEffect
} from "redux-saga/effects";
import arenaCurtainSaga from "./arenaCurtainSaga";
import audienceSaga from "./audienceSaga";

/**
 * This is a function that starts saga
 *
 * @export
 * @param {any} ctx
 */
export default function* root(ctx: any) {
  yield setContext(ctx);
  yield all([fork(audienceSaga), fork(arenaCurtainSaga)]);
}
