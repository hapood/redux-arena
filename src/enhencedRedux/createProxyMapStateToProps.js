function nullMapFunction() {}

export default function createProxyMapStateToProps(
  mapStateToProps = nullMapFunction,
  sceneNo,
  arenaReducerDict
) {
  let latestProps;
  let switchReducerKey = arenaReducerDict._curSwitch.reducerKey;
  let sceneReducerKey = arenaReducerDict._curScene.reducerKey;
  let sceneActions = arenaReducerDict._curScene.actions;
  return state => {
    if (state[switchReducerKey].sceneNo > sceneNo) {
      return latestProps;
    } else {
      latestProps = Object.assign(
        {
          state: state[sceneReducerKey],
          actions: sceneActions
        },
        mapStateToProps(state, arenaReducerDict)
      );
      return latestProps;
    }
  };
}
