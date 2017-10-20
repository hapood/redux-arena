import { bundleToComponent } from "../../tools"
import ArenaSceneLoadMotion from "./ArenaSceneLoadMotion"
import actions from "./actions"
import saga from "./saga"
import reducer from "./reducer"
import state from "./state"
import { State } from "./types"

export default bundleToComponent({
    Component: ArenaSceneLoadMotion,
    actions,
    reducer,
    saga,
    state,
    propsPicker: (state: State, actions, allState, { _arenaScene }) => ({
        ...state,
        actions,
        reducerKey: _arenaScene.reducerKey
    }),
    options: {
        vReducerKey: "_arenaSceneAnimation"
    }
})
