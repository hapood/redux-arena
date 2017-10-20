import { ForkEffect } from "redux-saga/effects"
import { takeLatestSceneAction, setSceneState } from "../../effects"
import ActionTypes from "./ActionTypes"
import AnimationPhase from "./AnimationPhase"
import { AsyncBundleThunk } from "./types"
/**
 * The asynchronous loading function of the scene, 
 * and finally the synchronous load function
 * 
 * @param {any} { arenaReducerDict, asyncSceneBundle } 
 * @returns 
 */
function* loadSceneBundle({ asyncBundleThunk }: { asyncBundleThunk: AsyncBundleThunk }) {
    yield setSceneState({
        isSceneReady: false,
        phase: AnimationPhase.LOADING,
        bundle: null
    })
    let bundleModule = yield asyncBundleThunk()
    let bundle = bundleModule.default ? bundleModule.default : bundleModule
    yield setSceneState({
        isSceneReady: true,
        bundle
    })
}

export default function*() {
    yield takeLatestSceneAction(ActionTypes.ARENA_SCENE_ANIMATION_LOAD_BUNDLE, loadSceneBundle)
}
