import ActionTypes from "../ActionTypes"
import {
    put,
    PutEffect,
    fork,
    ForkEffect,
    select,
    SelectEffect,
    getContext,
    setContext,
    CallEffectFactory,
    GetContextEffect
} from "redux-saga/effects"
import { bindActionCreators, ActionCreatorsMapObject, Dispatch } from "redux"
import { bindArenaActionCreators } from "../enhancedRedux"
import { createSceneReducer, sceneReducerWrapper } from "../reducers"
import {
    addStateTreeNode,
    sceneAddReducer,
    sceneReplaceReducer,
    buildSceneReducerDict
} from "../../utils"
import { ReducerDict, SceneReducer, SceneBundleOptions, SceneBundle } from "../types"
import { CurtainReduxInfo } from "../reducers/types"

const defaultActions = {
    setState: (state: any) => ({ type: ActionTypes.ARENA_SCENE_SET_STATE, state })
}

function bindActions(
    actions: ActionCreatorsMapObject,
    reducerKey: string,
    dispatch: Dispatch<any>,
    isSceneActions: boolean
) {
    if (isSceneActions === false) {
        return bindActionCreators(actions || defaultActions, dispatch)
    } else {
        return bindArenaActionCreators(actions || defaultActions, dispatch, reducerKey)
    }
}

function* forkSagaWithContext(saga: () => null, ctx: any) {
    yield setContext(ctx)
    yield fork(saga)
}

function buildReducerFactory<S = {}>(reducer: SceneReducer<S>, state: S, isSceneReducer: boolean) {
    return isSceneReducer === false
        ? (bindingReducerKey: string) => createSceneReducer(reducer, state, bindingReducerKey)
        : (bindingReducerKey: string) =>
              createSceneReducer(reducer && sceneReducerWrapper(reducer), state, bindingReducerKey)
}

function getParentReducerKey(arenaReducerDict: ReducerDict) {
    return (
        arenaReducerDict &&
        arenaReducerDict._arenaCurtain &&
        arenaReducerDict._arenaCurtain.reducerKey
    )
}

export interface ApplyReduxPayload {
    arenaReducerDict: ReducerDict
    state: {}
    saga: () => null
    actions: ActionCreatorsMapObject
    reducer: SceneReducer
    options: SceneBundleOptions
}

export function* sceneApplyRedux({
    arenaReducerDict,
    state,
    saga,
    actions,
    reducer,
    options = {}
}: ApplyReduxPayload) {
    let arenaStore = yield getContext("store")
    let reducerFactory = buildReducerFactory(reducer, state, options.isSceneReducer || false)
    let newReducerKey = sceneAddReducer(arenaStore, options.reducerKey, reducerFactory, state)
    let bindedActions = bindActions(
        actions,
        newReducerKey,
        arenaStore.dispatch,
        options.isSceneActions || false
    )
    let newArenaReducerDict = buildSceneReducerDict(
        arenaReducerDict,
        newReducerKey,
        options.vReducerKey,
        bindedActions
    )
    let newReduxInfo = {
        reducerKey: newReducerKey,
        origArenaReducerDict: arenaReducerDict,
        actions,
        options,
        saga,
        bindedActions,
        arenaReducerDict: newArenaReducerDict
    }
    addStateTreeNode(arenaStore, getParentReducerKey(newReduxInfo.arenaReducerDict), newReducerKey)
    if (saga) {
        newReduxInfo.saga = yield fork(forkSagaWithContext, saga, {
            arenaReducerDict: newReduxInfo.arenaReducerDict
        })
    }
    return newReduxInfo
}
export interface UpdateReduxPayload extends ApplyReduxPayload {
    curSceneBundle: SceneBundle
    reduxInfo: CurtainReduxInfo
}

export function* sceneUpdateRedux({
    arenaReducerDict,
    state,
    saga,
    actions,
    reducer,
    options = {},
    curSceneBundle,
    reduxInfo
}: UpdateReduxPayload) {
    let newReducerKey = reduxInfo.reducerKey
    let arenaStore = yield getContext("store")
    let reducerFactory = buildReducerFactory(reducer, state, options.isSceneReducer || false)
    let newReduxInfo = Object.assign({}, reduxInfo, { options })
    if (options.reducerKey != null && options.reducerKey !== reduxInfo.reducerKey) {
        let oldState = yield select((state: any) => state[reduxInfo.reducerKey])
        newReducerKey = sceneAddReducer(
            arenaStore,
            options.reducerKey,
            reducerFactory,
            state === curSceneBundle.state ? oldState : state
        )
        addStateTreeNode(
            arenaStore,
            getParentReducerKey(newReduxInfo.arenaReducerDict),
            newReducerKey
        )
    } else if (options.reducerKey === reduxInfo.reducerKey) {
        if (
            reducer !== curSceneBundle.reducer ||
            options.isSceneReducer !== reduxInfo.options.isSceneReducer
        ) {
            newReducerKey = sceneReplaceReducer(
                arenaStore,
                reduxInfo.reducerKey,
                reducerFactory,
                state === curSceneBundle.state ? null : state
            )
        } else if (state !== curSceneBundle.state) {
            arenaStore.dispatch({
                type: ActionTypes.ARENA_SCENE_REPLACE_STATE,
                _sceneReducerKey: newReducerKey,
                state
            })
        }
    } else if (state !== curSceneBundle.state) {
        yield put({
            type: ActionTypes.ARENA_SCENE_REPLACE_STATE,
            _sceneReducerKey: newReducerKey,
            state
        })
    }
    newReduxInfo.reducerKey = newReducerKey
    if (
        actions !== reduxInfo.actions ||
        options.isSceneActions !== reduxInfo.options.isSceneActions
    ) {
        newReduxInfo.actions = actions
        newReduxInfo.bindedActions = bindActions(
            actions,
            newReducerKey,
            arenaStore.dispatch,
            options.isSceneActions || false
        )
    }
    if (
        newReducerKey !== reduxInfo.reducerKey ||
        options.vReducerKey !== reduxInfo.options.vReducerKey ||
        arenaReducerDict !== reduxInfo.origArenaReducerDict
    ) {
        newReduxInfo.arenaReducerDict = buildSceneReducerDict(
            arenaReducerDict,
            newReducerKey,
            options.vReducerKey,
            newReduxInfo.actions
        )
    }
    if (saga) {
        newReduxInfo.saga = yield fork(forkSagaWithContext, saga, {
            arenaReducerDict: newReduxInfo.arenaReducerDict
        })
    }
    return newReduxInfo
}
