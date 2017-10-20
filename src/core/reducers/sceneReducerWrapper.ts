import { AnyAction } from "redux"
import { SceneReducer } from "../types"

export default function sceneReducerWrapper<S>(srcReducer: SceneReducer<S>) {
    return function(state: S, action: AnyAction, sceneReducerKey: string) {
        if (
            action._sceneReducerKey === sceneReducerKey ||
            (action.type && action.type.indexOf("@@") === 0)
        ) {
            return srcReducer(state, action, sceneReducerKey)
        } else {
            return state
        }
    }
}
