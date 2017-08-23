export default function replaceReducer(
  store,
  reducerKeyRemoved,
  reducerKeyAdded,
  reducerFactory,
  state
) {
  store.removeAndAddReducer({
    reducerKeyRemoved,
    reducerKeyAdded,
    reducer: reducerFactory(reducerKeyAdded),
    state
  });
  return reducerKeyAdded;
}
