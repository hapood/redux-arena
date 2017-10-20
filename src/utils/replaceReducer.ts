import ActionTypes from "../core/ActionTypes"
import { EhancedStore, SceneReducer } from "../core"
export function sceneReplaceReducer(
    store: EhancedStore,
    reducerKey: string,
    reducerFactory: (reducerKey: string) => SceneReducer,
    state: {} | null
) {
    store.dispatch({
        type: ActionTypes.ARENA_GLOBAL_PROPSPICKER_LOCK,
        lock: true
    })
    let newReducerKey = store.replaceReducer({
        reducerKey,
        reducer: reducerFactory(reducerKey),
        state
    })
    if (state)
        store.dispatch({
            type: ActionTypes.ARENA_SCENE_REPLACE_STATE,
            _sceneReducerKey: newReducerKey,
            state
        })
    store.dispatch({
        type: ActionTypes.ARENA_GLOBAL_PROPSPICKER_LOCK,
        lock: false
    })
    return reducerKey
}
