import initState from "./state";
import { AnyAction } from "redux";

export default function reducer(state = initState, action: AnyAction) {
  switch (action.type) {
    case "ADD_CNT":
      return Object.assign({}, state, { cnt: state.cnt + 1 });
    default:
      return state;
  }
}
