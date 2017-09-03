function defaultPropsPicker(sceneState, sceneActions) {
  return Object.assign({}, sceneState, {
    actions: sceneActions
  });
}

export default function createPropsPicker(
  propsPicker = defaultPropsPicker,
  reduxInfo
) {
  let { arenaReducerDict } = reduxInfo;
  let switchReducerKey = arenaReducerDict._curSwitch.reducerKey;
  let sceneReducerKey = arenaReducerDict._curScene.reducerKey;
  let sceneActions = arenaReducerDict._curScene.actions;
  let latestProps;
  return state => {
    if (state[switchReducerKey].reduxInfo !== reduxInfo) {
      return latestProps;
    } else {
      latestProps = propsPicker(
        state[sceneReducerKey],
        sceneActions,
        state,
        arenaReducerDict
      );
      return latestProps;
    }
  };
}
