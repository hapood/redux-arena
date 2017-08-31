import { getSceneEntry } from "../sagaOps";

export default function sceneActionSaga(srcSaga) {
  return function*(action) {
    let entry = yield* getSceneEntry();
    if (action && action._sceneReducerKey === entry.reducerKey) {
      yield* srcSaga(action);
    }
  };
}
