import { bundleToComponent } from "redux-arena/tools";
import * as actions from "./actions";
import OpPanel from "./OpPanel";

export default bundleToComponent({
  Component: OpPanel,
  actions
});
