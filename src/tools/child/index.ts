import bundleToComponent from "../bundleToComponent";
import state from "./state";
import reducer from "./reducer";
import Child from "./Child";
import actions from "./actions";
import { Props } from "./types";
import { StatelessComponent } from "react";
import { StateDict, ActionsDict } from "../../core";
import { State, Actions } from "./types";

const propsPicker = (
  { $0: state, parent: parentState }: StateDict<State, { parent: any }>,
  { $0: actions, parent: parentActions }: ActionsDict<Actions, { parent: any }>
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
