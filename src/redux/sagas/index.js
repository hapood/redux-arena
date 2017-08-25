/* eslint-disable no-constant-condition */
import { fork, all, setContext } from "redux-saga/effects";
import arenaSwitchSaga from "./arenaSwitchSaga";
import audienceSaga from "./audienceSaga";
import sceneReduxSaga from "./sceneReduxSaga";

/**
 * This is a function that starts saga
 * 
 * @export
 * @param {any} ctx 
 */
export default function* root(ctx) {
  yield setContext(ctx);
  yield all([fork(audienceSaga), fork(arenaSwitchSaga), fork(sceneReduxSaga)]);
}
