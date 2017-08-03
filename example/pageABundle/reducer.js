export default function reducer(state = getSceneInitState(), action) {
  switch (action.type) {
    case "ADD_CNT":
      return Object.assign({}, state, { cnt: state.cnt + 1 });
    default:
      return state;
  }
}
