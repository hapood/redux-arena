export default function createProxyMapStateToProps(
  mapStateToProps,
  reducerKey,
  arenaSwitchReducerKey,
  sceneNo
) {
  let latestProps;
  return state => {
    if (state[arenaSwitchReducerKey].sceneNo > sceneNo) {
      return latestProps;
    } else {
      latestProps = mapStateToProps(state, reducerKey);
      return latestProps;
    }
  };
}
