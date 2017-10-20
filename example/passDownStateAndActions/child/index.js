import state from "./state"
import reducer from "./reducer"
import Child from "./Child"
import * as actions from "./actions"

export default {
    Component: Child,
    state,
    actions,
    reducer,
    propsPicker: (state, actions, allState, { parent }) => {
        return {
            name: state.name,
            cnt: state.cnt,
            actions,
            parentState: allState[parent.reducerKey],
            parentActions: parent.actions
        }
    }
}
