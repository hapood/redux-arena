export function calcSwitchReducerDict(
  arenaReducerDict,
  switchReducerKey,
  vReducerKey
) {
  let item = { actions: {}, reducerKey: switchReducerKey, vReducerKey };
  let newDict = Object.assign({}, arenaReducerDict, {
    [switchReducerKey]: item
  });
  if (vReducerKey) {
    newDict[vReducerKey] = item;
  }
  newDict._curSwitch = item;
  newDict._curScene = null;
  return newDict;
}
