import { fork, take, cancel, Pattern, ForkEffect } from "redux-saga/effects"
import getArenaReducerDictEntry from "./getArenaReducerDictEntry"

function* _takeLatestSceneAction(pattern: Pattern, saga: () => void, key: string, args: any) {
    let lastTask
    while (true) {
        let action = yield take(pattern)
        let entry = yield getArenaReducerDictEntry(key)
        if (action._sceneReducerKey === entry.reducerKey) {
            if (lastTask) yield cancel(lastTask)
            lastTask = yield fork(saga, ...args, action)
        }
    }
}

export default function takeLatestSceneAction(
    pattern: Pattern,
    saga: (...params: any[]) => any,
    key: string = "_arenaScene",
    ...args: any[]
) {
    return fork(_takeLatestSceneAction, pattern, saga, key, args)
}
