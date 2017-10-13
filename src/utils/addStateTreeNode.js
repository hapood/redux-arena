import { ARENA_STATETREE_NODE_ADD } from "../core/actionTypes";

export function curtainAddStateTreeNode(store, parentReducerKey, reducerKey) {
  store.dispatch({
    type: ARENA_STATETREE_NODE_ADD,
    nodeType: "curtain",
    parentReducerKey,
    reducerKey
  });
}

export function sceneAddStateTreeNode(store, parentReducerKey, reducerKey) {
  store.dispatch({
    type: ARENA_STATETREE_NODE_ADD,
    nodeType: "scene",
    parentReducerKey,
    reducerKey
  });
}
