export default function replaceReducer(
  store,
  reducerKey,
  reducerFactory,
  state
) {
  store.replaceReducer({
    reducerKey,
    reducer: reducerFactory(reducerKey),
    state
  });
  return reducerKey;
}
