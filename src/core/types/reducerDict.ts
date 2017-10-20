import { ActionCreatorsMapObject } from "redux"

export type ReducerDictItem = {
    reducerKey: string
    vReducerKey: string | null | undefined
    actions: ActionCreatorsMapObject
}

export type ReducerDict = { [key: string]: ReducerDictItem }
