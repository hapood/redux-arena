import { getSceneReducerKey } from "../sagaOps";

export default function sceneActionSaga(srcSaga) {
  return function*(action) {
    let sceneReducerKey = yield* getSceneReducerKey();
    if (action && action._sceneReducerKey === sceneReducerKey) {
      yield* srcSaga(action);
    }
  };
}
