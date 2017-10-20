import React from "react"
import { expect } from "chai"
import { spy } from "sinon"
import { createMount } from "../../testUtils"
import { createArenaStore, loadMotionPhase } from "src"
import TestHOC from "./TestHOC"

function selectAnimationState(allStates, name) {
    let animationState
    Object.keys(allStates).forEach(key => {
        if (allStates[key].phase != null) {
            animationState = allStates[key]
        }
    })
    return animationState
}

describe("<ArenaSceneLoadMotion /> integration", () => {
    let store, mount, wrapper

    before(() => {
        mount = createMount()
        store = createArenaStore()
    })

    after(() => {
        mount.cleanUp()
        store.close()
    })

    it("should step into IN phase correctly", () => {
        wrapper = mount(
            <TestHOC
                store={store}
                asyncBundleThunk={() => import("../../BundleComponentForTestA")}
            />
        )
        let flagPromise = new Promise(resolve => {
            let unsubscribe = store.subscribe(() => {
                let animationState = selectAnimationState(store.getState())
                if (animationState && animationState.phase === loadMotionPhase.IN) {
                    unsubscribe()
                    resolve(true)
                }
            })
        })
        return flagPromise
    })
})
