import { getSceneKey } from "../sagaOps";

export default function sceneSaga(srcSaga) {
  return function*(action) {
    let sceneKey = yield* getSceneKey();
    if (action._sceneKey === sceneKey) {
      yield* srcSaga(action);
    }
  };
}
