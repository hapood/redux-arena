import state from "./state";
import reducer from "./reducer";
import Child from "./Child";
import * as actions from "./actions";

export default {
  Component: Child,
  state,
  actions,
  reducer,
  mapStateToProps: (state, { parent }) => {
    return {
      parentState: state[parent.reducerKey],
      parentActions: parent.actions
    };
  }
};
