import initState from "./state";
import { sceneReducer } from "redux-arena/sceneScope";

function reducer(state = initState, action) {
  switch (action.type) {
    case "ADD_CNT":
      return Object.assign({}, state, { cnt: state.cnt + 1 });
    default:
      return state;
  }
}

export default sceneReducer(reducer);
