import state from "./state";
import reducer from "./reducer";
import Parent from "./Parent";
import * as actions from "./actions";

export default {
  Component: Parent,
  state,
  actions,
  reducer,
  options: {
    vReducerKey: "parent"
  },
  mapStateToProps: state => {
    return {};
  }
};
