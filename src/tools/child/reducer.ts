import { AnyAction } from "redux";
import initState from "./state";
import {State} from './types'
import { SceneReducer } from "../../core";
function reducer(state = initState, action: AnyAction) {
  switch (action.type) {
    case "ADD_CNT":
      return Object.assign({}, state, { cnt: state.cnt + 1 });
    default:
      return state;
  }
}

export default reducer as SceneReducer<State>;
