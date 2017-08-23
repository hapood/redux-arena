export default function sceneReducer(srcReducer) {
  return function(state, action, sceneKey) {
    if (
      action._sceneKey === sceneKey ||
      (action.type && action.type.indexOf("@@") === 0)
    ) {
      return srcReducer(state, action, sceneKey);
    } else {
      return state;
    }
  };
}
