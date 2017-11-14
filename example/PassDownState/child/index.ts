import { StateDict, ActionsDict, bundleToComponent } from "redux-arena";
import state from "./state";
import reducer from "./reducer";
import Child from "./Child";
import actions from "./actions";
import { Props, State, Actions } from "./types";
import { State as ParentState, Actions as ParentActions } from "../types";

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
