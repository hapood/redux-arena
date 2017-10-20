import { AnyAction } from "redux"
import { call, CallEffect, put } from "redux-saga/effects"
import getArenaReducerDictEntry from "./getArenaReducerDictEntry"

function* _putSceneAction(action: AnyAction, key: string) {
    let entry = yield getArenaReducerDictEntry(key)
    let newAction = Object.assign({}, action, {
        _sceneReducerKey: entry.reducerKey
    })
    yield put(newAction)
}

function* _putSceneActionResolve(actionPromise: Promise<AnyAction>, key: string) {
    let action = yield actionPromise
    let entry = yield getArenaReducerDictEntry(key)
    let newAction = Object.assign({}, action, {
        _sceneReducerKey: entry.reducerKey
    })
    yield put(newAction)
}

export type PutSceneAction = {
    (action: AnyAction, key: string): void
    resolve: (action: AnyAction, key: string) => void
}

const putSceneAction: any = function(action: AnyAction, key: string = "_arenaScene") {
    return call(_putSceneAction, action, key)
}

putSceneAction.resolve = function(actionPromise: Promise<AnyAction>, key: string = "_arenaScene") {
    return call(_putSceneActionResolve, actionPromise, key)
}

export default <PutSceneAction>putSceneAction
