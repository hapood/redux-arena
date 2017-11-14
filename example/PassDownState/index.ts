import { bundleToComponent } from "redux-arena";
import state from "./state";
import reducer from "./reducer";
import Parent from "./Parent";
import actions from "./actions";

export default bundleToComponent({
  Component: Parent,
  state,
  actions,
  reducer,
  options: {
    vReducerKey: "parent"
  }
});
