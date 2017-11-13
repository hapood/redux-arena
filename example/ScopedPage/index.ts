import { bundleToComponent } from "redux-arena/tools";
import state from "./state";
import reducer from "./reducer";
import saga from "./saga";
import actions from "./actions";
import ScopedPage from "./ScopedPage";

export default bundleToComponent({
  Component: ScopedPage,
  state,
  saga,
  reducer,
  actions
});
