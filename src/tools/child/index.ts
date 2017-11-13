import bundleToComponent from "../bundleToComponent";
import state from "./state";
import reducer from "./reducer";
import Child from "./Child";
import actions from "./actions";
import { Props } from "./types";
import { StatelessComponent } from "react";

const propsPicker = (
  { $0: state, parent: parentState },
  { $0: actions, parent: parentActions }
) => ({
  name: state.name,
  cnt: state.cnt,
  actions,
  parentState: parentState,
  parentActions: parentActions
});

export default bundleToComponent({
  Component: Child,
  state,
  actions,
  reducer,
  propsPicker
});
