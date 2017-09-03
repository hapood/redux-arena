import { bundleToComponent } from "redux-arena/helper";
import * as actions from "./actions";
import OpPanel from "./OpPanel";

export default bundleToComponent({
  Component: OpPanel,
  actions
});
