import { EhancedStore } from "../core";
import { actionTypes } from "../core/actionTypes";

export default function addStateTreeNode(
  store: EhancedStore<any>,
  pReducerKey: string,
  reducerKey: string
) {
  store.dispatch({
    type: actionTypes.ARENA_STATETREE_NODE_ADD,
    pReducerKey,
    reducerKey
  });
}
