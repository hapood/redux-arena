export default function sceneReducer(srcReducer) {
  return function(state, action, sceneReducerKey) {
    if (
      action._sceneReducerKey === sceneReducerKey ||
      (action.type && action.type.indexOf("@@") === 0)
    ) {
      return srcReducer(state, action, sceneReducerKey);
    } else {
      return state;
    }
  };
}
