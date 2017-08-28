function nullMapFunction() {}

export default function createProxyMapStateToProps(
  mapStateToProps = nullMapFunction,
  reducerKey,
  arenaSwitchReducerKey,
  sceneNo,
  connectedActions = {}
) {
  let latestProps;
  return state => {
    if (state[arenaSwitchReducerKey].sceneNo > sceneNo) {
      return latestProps;
    } else {
      latestProps = Object.assign(
        {
          state: state[reducerKey],
          actions: connectedActions
        },
        mapStateToProps(state, reducerKey)
      );
      return latestProps;
    }
  };
}
