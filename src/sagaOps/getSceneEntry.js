import { getContext } from "redux-saga/effects";

export default function* getSceneEntry(key) {
  let newKey = key || "_curScene";
  let dict = yield getContext("arenaReducerDict");
  let entry = dict[newKey];
  if (entry == null) throw new Error(`can not get entry of key: "${newKey}"`);
  return entry;
}
