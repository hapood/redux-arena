export default function addReducer(store, reducerKey, reducerFactory, state) {
  if (reducerKey != null) {
    let flag = store.addReducer({
      reducerKey,
      reducer: reducerFactory(reducerKey),
      state
    });
    if (flag === false) {
      throw new Error(`Reducer key [${reducerKey}] is already exsited.`);
    }
  } else {
    do {
      reducerKey = String(Math.random()).slice(2);
      let flag = store.addReducer({
        reducerKey,
        reducer: reducerFactory(reducerKey),
        state
      });
      if (flag === false) reducerKey = null;
    } while (reducerKey == null);
  }
  return reducerKey;
}
