import { ReducerDict, ReducerDictItem } from "../core";
import { ActionCreatorsMapObject } from "redux";

function buildReducerKey(
  arenaReducerDict: ReducerDict | null,
  reducerKey: string,
  vReducerKey: string,
  actions: ActionCreatorsMapObject,
  curReducerKey: string
): ReducerDict {
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
  arenaReducerDict: ReducerDict | null,
  reducerKey: string,
  vReducerKey: string
): ReducerDict & { _arenaScene: ReducerDictItem } {
  let newDict: any = buildReducerKey(
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
  arenaReducerDict: ReducerDict | null,
  reducerKey: string,
  vReducerKey: string,
  actions: ActionCreatorsMapObject
) {
  return buildReducerKey(
    arenaReducerDict,
    reducerKey,
    vReducerKey,
    actions,
    "_arenaScene"
  );
}
