import { getSceneKey } from "../sagaOps";

export default function sceneActionSaga(srcSaga) {
  return function*(action) {
    let sceneKey = yield* getSceneKey();
    if (action && action._sceneKey === sceneKey) {
      yield* srcSaga(action);
    }
  };
}
