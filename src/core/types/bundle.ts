import { ComponentClass, SFC } from "react"
import { ActionCreatorsMapObject } from "redux"
import { ReducerDict } from "./reducerDict"
import { SceneReducer } from "./reducer"
import { RootState } from "../reducers/types"

export type PropsPicker<S, AS extends RootState = RootState> = (
    state: S,
    actions: ActionCreatorsMapObject,
    allState: AS,
    reducerDict: ReducerDict
) => S

export type SceneBundleOptions = {
    reducerKey?: string
    vReducerKey?: string
    isSceneActions?: boolean
    isSceneReducer?: boolean
}

export type SceneBundle<P = {}, S = {}> = {
    Component: ComponentClass<P> | SFC<P>
    state?: S
    actions?: ActionCreatorsMapObject
    propsPicker?: PropsPicker<S, any>
    saga?: (...params: any[]) => any
    reducer?: SceneReducer<S>
    options?: SceneBundleOptions
}
