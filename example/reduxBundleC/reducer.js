import initState from "./state";
import { sceneReducer } from "../../src/sceneScope";

function reducer(state = initState, action) {
  switch (action.type) {
    case "ADD_CNT":
      return Object.assign({}, state, { cnt: state.cnt + 1 });
    default:
      return state;
  }
}

export default sceneReducer(reducer);
