export default function createProxyMapStateToProps(
  mapStateToProps,
  reducerKey
) {
  let latestProps;
  return state => {
    if (state[reducerKey] == null) {
      return latestProps;
    } else {
      latestProps = mapStateToProps(state, reducerKey);
      return latestProps;
    }
  };
}
