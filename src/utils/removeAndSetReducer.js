export default function replaceReducer(
  store,
  reducerKeyRemove,
  reducerKeySet,
  reducerFactory,
  state
) {
  store.replaceReducer({
    reducerKeyRemove,
    reducerKeySet,
    reducer: reducerFactory(reducerKeySet),
    state
  });
  return reducerKeySet;
}
