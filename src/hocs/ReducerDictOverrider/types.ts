import { ReactElement } from "react"
import { ReducerDict } from "../../core"

export type ReducerDictOverriderProps = {
    reducerDict: ReducerDict
    children: ReactElement<{}>
}
