import state from "./state";
import reducer from "./reducer";
import saga from "./saga";
import * as actions from "./actions";
import ScopedPage from "./ScopedPage";

export default {
  Component: ScopedPage,
  state,
  saga,
  reducer,
  actions
};
