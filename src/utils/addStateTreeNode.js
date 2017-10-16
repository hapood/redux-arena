import { ARENA_STATETREE_NODE_ADD } from "../core/actionTypes";

export default function addStateTreeNode(store, pReducerKey, reducerKey) {
  store.dispatch({
    type: ARENA_STATETREE_NODE_ADD,
    pReducerKey,
    reducerKey
  });
}
