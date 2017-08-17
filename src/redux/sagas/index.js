/* eslint-disable no-constant-condition */
import { fork, all, setContext } from "redux-saga/effects";
import senceSwitchSaga from "./senceSwitchSaga";
import audienceSaga from "./audienceSaga";
import sceneSaga from "./sceneSaga";

export default function* root(ctx) {
  yield setContext(ctx);
  yield all([
    fork(audienceSaga),
    fork(senceSwitchSaga),
    fork(sceneSaga)
  ]);
}
