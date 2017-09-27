import { bundleToComponent } from "redux-arena/tools";
import ArenaSceneMotion from "./ArenaSceneMotion";
import * as actions from "./actions";
import reducer from "./reducer";

export default bundleToComponent({
  Component: ArenaSwitchMotion,
  actions,
  reducer,
  propsPicker: (state, actions, allState, { _arenaScene }) => ({
    ...state,
    actions,
    reducerKey: _arenaScene.reducerKey
  }),
  options: {
    vReducerKey: "_arenaSceneAnimation",
    isSceneReducer: false
  }
});
