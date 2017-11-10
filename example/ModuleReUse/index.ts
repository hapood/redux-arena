import { bundleToComponent } from "redux-arena/tools";
import state from "./state";
import reducer from "./reducer";
import * as actions from "./actions";
import Container from "./Container";

export default bundleToComponent({
  Component: Container,
  state,
  reducer,
  actions
});
