import { Map } from "immutable"
import { ArenaState } from "./types"

export default function getInitState(): ArenaState {
    return {
        audienceSagaTask: null,
        propsLock: false,
        stateTree: Map(),
        stateTreeDict: Map()
    }
}
