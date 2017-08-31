import { getArenaReducerDictEntry } from "../sagaOps";

export default function sceneActionSaga(srcSaga) {
  return function*(action) {
    let entry = yield* getArenaReducerDictEntry("_curScene");
    if (action && action._sceneReducerKey === entry.reducerKey) {
      yield* srcSaga(action);
    }
  };
}
