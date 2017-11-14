import { SceneBundle } from "src";
import state from "./state";
import reducer from "./reducer";
import actions from "./actions";
import Page from "./Page";
import { State, Props } from "./types";

export default {
  Component: Page,
  state,
  reducer,
  actions,
  propsPicker: ({ _arenaScene: state }, { _arenaScene: actions }) => ({
    ...state,
    actions
  })
} as SceneBundle<{}, {}, {}, {}>;

export { State, Props } from "./types";
