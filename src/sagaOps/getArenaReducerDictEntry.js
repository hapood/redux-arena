import { getContext } from "redux-saga/effects";

export default function* getArenaReducerDictEntry(key) {
  let dict = yield getContext("arenaReducerDict");
  let entry = dict[key];
  if (entry == null) throw new Error(`can not get entry of key: "${key}"`);
  return entry;
}
