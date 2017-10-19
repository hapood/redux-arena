import { EhancedStore } from "../core";
import { ActionTypes } from "../core/ActionTypes";

export default function addStateTreeNode(
  store: EhancedStore<any>,
  pReducerKey: string,
  reducerKey: string
) {
  store.dispatch({
    type: ActionTypes.ARENA_STATETREE_NODE_ADD,
    pReducerKey,
    reducerKey
  });
}
