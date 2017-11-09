import { AnyAction } from "redux";
import { SceneReducer } from "../types";

export default function sceneReducerWrapper<S>(srcReducer: SceneReducer<S>) {
  return function(state: S, action: AnyAction, isSceneAction: boolean) {
    if (isSceneAction || (action.type && action.type.indexOf("@@") === 0)) {
      return srcReducer(state, action, isSceneAction);
    } else {
      return state;
    }
  };
}
