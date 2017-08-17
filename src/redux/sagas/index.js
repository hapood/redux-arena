/* eslint-disable no-constant-condition */
import { fork, all, setContext } from "redux-saga/effects";
import senceSwitchSaga from "./senceSwitchSaga";
import audienceSaga from "./audienceSaga";
import historySaga from "./historySaga";
import sceneSaga from "./sceneSaga";

export default function* root(ctx) {
  yield setContext(ctx);
  yield all([
    fork(audienceSaga),
    fork(historySaga),
    fork(senceSwitchSaga),
    fork(sceneSaga)
  ]);
}
