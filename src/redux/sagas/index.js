/* eslint-disable no-constant-condition */
import { fork, all, setContext } from "redux-saga/effects";
import senceSwitchSaga from "./senceSwitchSaga";
import audienceSaga from "./audienceSaga";
import historySaga from "./historySaga";

export default function* root({ ctx }) {
  yield setContext(ctx);
  yield all([fork(senceSwitchSaga), fork(audienceSaga), fork(historySaga)]);
}
