function defaultPropsPicker(sceneState, sceneActions) {
  return Object.assign({}, sceneState, {
    actions: sceneActions
  });
}

export default function createPropsPicker(
  propsPicker = defaultPropsPicker,
  reduxInfo,
  mutableObj
) {
  let { arenaReducerDict } = reduxInfo;
  let sceneReducerKey = arenaReducerDict._arenaScene.reducerKey;
  let sceneActions = arenaReducerDict._arenaScene.actions;
  let latestProps;
  return state => {
    if (
      mutableObj.isObsolete === true ||
      state.arena.propsLock !== false ||
      state.arena.stateTreeDict.getIn([sceneReducerKey, "isObsolete"]) === true
    ) {
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
