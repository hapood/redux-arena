import { SFC } from "react"
import { ActionCreatorsMapObject } from "redux"
import { ForkEffect } from "redux-saga/effects"
import { SceneBundle, ReducerDict, SceneBundleOptions } from "../../types"

export type CurtainReduxInfo = {
    reducerKey: string
    origArenaReducerDict: ReducerDict
    actions: ActionCreatorsMapObject
    options: SceneBundleOptions
    saga: ForkEffect
    bindedActions: ActionCreatorsMapObject
    arenaReducerDict: ReducerDict
}

export type CurtainMutableObj = {
    isObsolete: boolean
}

export type CurtainState<P = {}, RS = {}> = {
    PlayingScene: SFC<P> | null
    curSceneBundle: SceneBundle<P, RS> | null
    reduxInfo: CurtainReduxInfo | null
    mutableObj: CurtainMutableObj
}
