import { ARENA_STATETREE_NODE_DISABLE } from "../core/actionTypes";

export function curtainDisableStateTreeNode(store, reducerKey) {
  store.dispatch({
    type: ARENA_STATETREE_NODE_DISABLE,
    reducerKey
  });
}

export function sceneDisableStateTreeNode(store, reducerKey) {
  store.dispatch({
    type: ARENA_STATETREE_NODE_DISABLE,
    reducerKey
  });
}
