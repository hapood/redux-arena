/* eslint-disable no-constant-condition */
import { fork, all } from "redux-saga/effects";
import senceSwitchSaga from "./senceSwitchSaga";
import audienceSaga from "./audienceSaga";
import historySaga from "./historySaga";

export default function* root() {
  yield all([fork(senceSwitchSaga), fork(audienceSaga), fork(historySaga)]);
}
