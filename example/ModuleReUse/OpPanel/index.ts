import { bundleToComponent } from "redux-arena/tools";
import actions from "./actions";
import OpPanel from "./OpPanel";

export default bundleToComponent({
  Component: OpPanel,
  actions
});
