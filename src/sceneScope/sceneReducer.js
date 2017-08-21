export default function sceneReducer(srcReducer) {
  return function(state, action, sceneKey) {
    if (action._sceneKey !== sceneKey) {
      return state;
    } else {
      return srcReducer(state, action, sceneKey);
    }
  };
}
