import { EnhancedStore } from "../core";
import ActionTypes from "../core/ActionTypes";

export default function addStateTreeNode(
  store: EnhancedStore<any>,
  pReducerKey: string,
  reducerKey: string
) {
  store.dispatch({
    type: ActionTypes.ARENA_STATETREE_NODE_ADD,
    pReducerKey,
    reducerKey
  });
}
