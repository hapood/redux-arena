import { bundleToComponent } from "redux-arena/tools";
import state from "./state";
import reducer from "./reducer";
import Child from "./Child";
import actions from "./actions";
import { Props, State, Actions } from "./types";
import { State as ParentState, Actions as ParentActions } from "../types";

const propsPicker = (
  { $0: state, parent: parentState }: { $0: State; parent: ParentState } ,
  { $0: actions, parent: parentActions }: { $0: Actions; parent: ParentActions }
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
