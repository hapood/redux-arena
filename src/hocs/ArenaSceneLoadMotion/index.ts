import { bundleToComponent } from "../../tools";
import ArenaSceneLoadMotion from "./ArenaSceneLoadMotion";
import * as actions from "./actions";
import saga from "./saga";
import reducer from "./reducer";

export default bundleToComponent({
  Component: ArenaSceneLoadMotion,
  actions,
  reducer,
  saga,
  propsPicker: (state, actions, allState, { _arenaScene }) => ({
    ...state,
    actions,
    reducerKey: _arenaScene.reducerKey
  }),
  options: {
    vReducerKey: "_arenaSceneAnimation"
  }
});
