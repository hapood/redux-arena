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
  let curtainReducerKey = arenaReducerDict._curCurtain.reducerKey;
  let sceneReducerKey = arenaReducerDict._curScene.reducerKey;
  let sceneActions = arenaReducerDict._curScene.actions;
  let latestProps;
  return state => {
    if (state[curtainReducerKey].reduxInfo !== reduxInfo) {
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
