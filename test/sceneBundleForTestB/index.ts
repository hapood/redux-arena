import state from "./state";
import reducer from "./reducer";
import actions from "./actions";
import Page from "./Page";
import { State, Props } from "./types";
import { SceneBundle } from "src";

export default {
  Component: Page,
  state,
  reducer,
  actions
} as SceneBundle<Props, State>;

export { State, Props } from "./types";
