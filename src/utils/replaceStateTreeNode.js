import { ARENA_STATETREE_NODE_REPLACE } from "../core/actionTypes";

export function curtainReplaceStateTreeNode(store, reducerKey, newReducerKey) {
  store.dispatch({
    type: ARENA_STATETREE_NODE_REPLACE,
    reducerKey,
    newReducerKey
  });
}

export function sceneReplaceStateTreeNode(store, reducerKey, newReducerKey) {
  store.dispatch({
    type: ARENA_STATETREE_NODE_REPLACE,
    reducerKey,
    newReducerKey
  });
}
