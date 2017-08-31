export function calcSwitchReducerDict(
  arenaReducerDict,
  switchReducerKey,
  reducerKey,
  vReducerKey
) {
  let newDict = Object.assign({}, arenaReducerDict);
  let item = { actions: {}, reducerKey: switchReducerKey };
  if (reducerKey) {
    newDict[reducerKey] = item;
  }
  if (vReducerKey) {
    newDict[vReducerKey] = item;
  }
  newDict._curSwitch = item;
  newDict._curScene = null;
  return newDict;
}
