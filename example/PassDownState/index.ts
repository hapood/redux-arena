import { bundleToComponent } from "redux-arena/tools";
import state from "./state";
import reducer from "./reducer";
import Parent from "./Parent";
import * as actions from "./actions";

export default bundleToComponent{
  Component: Parent,
  state,
  actions,
  reducer,
  options: {
    vReducerKey: "parent"
  }
});
