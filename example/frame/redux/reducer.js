import ActionTypes from "./ActionTypes";
import initState from "./state";

export default function reducer(state = initState, action) {
  switch (action.type) {
    case ActionTypes.FRAME_SET_STATE:
      return Object.assign({}, state, action.state);
    case ActionTypes.ADD_CNT:
      return Object.assign({}, state, {
        cnt: state.cnt + (action.num != null ? action.num : 1)
      });
    default:
      return state;
  }
}
