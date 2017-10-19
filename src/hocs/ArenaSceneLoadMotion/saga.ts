import { takeLatestSceneAction, setSceneState } from "../../effects";
import { ARENA_SCENE_ANIMATION_LOAD_BUNDLE } from "./ActionTypes";
import { LOADING } from "./animationPhase";

/**
 * The asynchronous loading function of the scene, 
 * and finally the synchronous load function
 * 
 * @param {any} { arenaReducerDict, asyncSceneBundle } 
 * @returns 
 */
function* loadSceneBundle({ asyncBundleThunk }) {
  yield setSceneState({
    isSceneReady: false,
    phase: LOADING,
    bundle: null
  });
  let bundleModule = yield asyncBundleThunk();
  let bundle = bundleModule.default ? bundleModule.default : bundleModule;
  yield setSceneState({
    isSceneReady: true,
    bundle
  });
}

export default function*() {
  yield takeLatestSceneAction(
    ARENA_SCENE_ANIMATION_LOAD_BUNDLE,
    loadSceneBundle
  );
}
