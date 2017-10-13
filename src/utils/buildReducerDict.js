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
  newDict._arenaScene = null;
  return newDict;
}

export function buildCurtainReducerDict(
  arenaReducerDict,
  curtainReducerKey,
  vReducerKey
) {
  return buildReducerKey(
    arenaReducerDict,
    curtainReducerKey,
    vReducerKey,
    {},
    "_arenaCurtain"
  );
}

export function buildSceneReducerDict(
  arenaReducerDict,
  reducerKey,
  vReducerKey,
  actions
) {
  return buildReducerKey(
    arenaReducerDict,
    curtainReducerKey,
    vReducerKey,
    actions,
    "_arenaCurtain"
  );
}
