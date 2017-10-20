import React from "react"
import { expect } from "chai"
import { spy } from "sinon"
import { createMount } from "../../testUtils"
import { createArenaStore } from "src"
import sceneBundleForTestA from "../../BundleComponentForTestA"
import TestHoc from "./TestHOC"

function selectNeededStates(allStates, name) {
    let { arena, ...otherState } = allStates
    let metaState, bundleState
    Object.keys(otherState).forEach(key => {
        if (otherState[key].name === name) {
            bundleState = otherState[key]
        } else if (otherState[key].curSceneBundle != null) {
            metaState = otherState[key]
        }
    })
    return {
        arena,
        metaState,
        bundleState
    }
}

describe("<ArenaScene /> integration", () => {
    let mount, store, wrapper

    before(() => {
        mount = createMount()
        store = createArenaStore()
    })

    after(() => {
        mount.cleanUp()
        store.close()
    })

    it("should mount with right redux state", () => {
        wrapper = mount(<TestHoc sceneBundle={sceneBundleForTestA} store={store} />)
        let flagPromise = new Promise(resolve => {
            let unsubscribe = store.subscribe(() => {
                let { arena, metaState, bundleState } = selectNeededStates(
                    store.getState(),
                    "PageA"
                )
                if (arena && metaState && bundleState) {
                    if (bundleState.cnt !== 4 || bundleState.sagaCnt !== 1) return
                    unsubscribe()
                    expect(bundleState.pageA).to.be.true
                    resolve(true)
                }
            })
        })
        return flagPromise
    })

    it("should unmount with right redux state", () => {
        mount(<div />)
        let flagPromise = new Promise(resolve => {
            let unsubscribe = store.subscribe(() => {
                let state = store.getState()
                Object.keys(state).length == 1
                if (Object.keys(state).length == 1) {
                    unsubscribe()
                    expect(state.arena).to.not.be.null
                    resolve(true)
                }
            })
        })
        return flagPromise
    })
})
