function buildReducerKey(
  arenaReducerDict,
  reducerKey,
  vReducerKey,
  actions,
  curReducerKey
) {
  let item = { actions, reducerKey, vReducerKey };
  let newDict = Object.assign({}, arenaReducerDict, {
    [reducerKey]: item
  });
  if (vReducerKey) {
    newDict[vReducerKey] = item;
  }
  newDict[curReducerKey] = item;
  return newDict;
}

export function buildCurtainReducerDict(
  arenaReducerDict,
  reducerKey,
  vReducerKey
) {
  let newDict = buildReducerKey(
    arenaReducerDict,
    reducerKey,
    vReducerKey,
    {},
    "_arenaCurtain"
  );
  newDict._arenaScene = null;
  return newDict;
}

export function buildSceneReducerDict(
  arenaReducerDict,
  reducerKey,
  vReducerKey,
  actions
) {
  return buildReducerKey(
    arenaReducerDict,
    reducerKey,
    vReducerKey,
    actions,
    "_arenaScene"
  );
}
