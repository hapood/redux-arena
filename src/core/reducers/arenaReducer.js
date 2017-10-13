import {
  ARENA_SET_STATE,
  ARENA_REPLACE_STATE,
  ARENA_GLOBAL_PROPSPICKER_LOCK,
  ARENA_STATETREE_NODE_ADD,
  ARENA_STATETREE_NODE_REPLACE,
  ARENA_STATETREE_NODE_DISABLE,
  ARENA_STATETREE_NODE_DELETE
} from "../actionTypes.js";
import getArenaInitState from "./getArenaInitState";
import Immutable from "immutable";

function getFullPath(node, stateTreeDict) {
  if (node.get("pReducerKey") == null) return [];
  return getFullPath(
    stateTreeDict.get(node.get("pReducerKey")),
    stateTreeDict
  ).concat(node.get("reducerKey"));
}

function addStateTreeNode(state, parentReducerKey, reducerKey, nodeType) {
  let { stateTree: newStateTree, stateTreeDict: newStateTreeDict } = state;
  let newNode = Immutable.Map({
    isDisabled: false,
    pReducerKey: null,
    reducerKey,
    nodeType,
    children: Immutable.Map()
  });
  console.log("add", parentReducerKey, reducerKey);
  if (parentReducerKey == null) {
    newStateTree = newStateTree.set(reducerKey, newNode);
  } else {
    let parentNode = newStateTreeDict.get(parentReducerKey);
    newNode = newNode.set("pReducerKey", parentNode.get("reducerKey"));
    let newParentNode = parentNode.setIn(["children", reducerKey], newNode);
    newStateTree = newStateTree.setIn(
      getFullPath(newParentNode, newStateTreeDict),
      newParentNode
    );
    newStateTreeDict = newStateTreeDict.set(parentReducerKey, newParentNode);
  }
  newStateTreeDict = newStateTreeDict.set(reducerKey, newNode);
  return Object.assign({}, state, {
    stateTree: newStateTree,
    stateTreeDict: newStateTreeDict
  });
}

function disableNodeCascade(node) {
  let nodeDict = {};
  if (node.get("isDisabled") === true) return [node, nodeDict];
  let newNode = node
    .update("children", children =>
      children.map(child => {
        let [newChild, childNodeDict] = disableNodeCascade(child);
        Object.assign(nodeDict, childNodeDict);
        nodeDict[newChild.get("reducerKey")] = newChild;
        return newChild;
      })
    )
    .set("isDisabled", true);
  nodeDict[newNode.get("reducerKey")] = newNode;
  return [newNode, nodeDict];
}

function disableStateTreeNode(state, reducerKey) {
  let { stateTree: newStateTree, stateTreeDict: newStateTreeDict } = state;
  let curNode = newStateTreeDict.get(reducerKey);
  let [newNode, nodeDict] = disableNodeCascade(curNode);
  newStateTree = newStateTree.setIn(
    getFullPath(curNode, newStateTreeDict),
    newNode
  );
  newStateTreeDict = newStateTreeDict.merge(nodeDict);
  return Object.assign({}, state, {
    stateTree: newStateTree,
    stateTreeDict: newStateTreeDict
  });
}

function deleteStateTreeNode(state, reducerKey) {
  let { stateTree: newStateTree, stateTreeDict: newStateTreeDict } = state;
  let curNode = newStateTreeDict.get(reducerKey);
  let deltaDict = Immutable.Map(
    reducerKeys.map(reducerKey4d => [
      reducerKey4d,
      newStateTreeDict.get(reducerKey4d).set("isObsolete", true)
    ])
  );
  newStateTreeDict.merge(deltaDict);
  if (curNode.get("children").count() === 0) {
    return state;
  } else {
  }
  newStateTree = newStateTree.deleteIn(getFullPath(curNode, newStateTreeDict));
  getReducerKeyCasade(curNode);
  newStateTreeDict = newStateTreeDict.filter(
    node => node.get("isDisabled") !== true
  );
  return Object.assign({}, state, {
    stateTree: newStateTree,
    stateTreeDict: newStateTreeDict
  });
}

export default function reducer(state = getArenaInitState(), action) {
  switch (action.type) {
    case ARENA_SET_STATE:
      return Object.assign({}, state, action.state);
    case ARENA_REPLACE_STATE:
      return Object.assign({}, action.state);
    case ARENA_GLOBAL_PROPSPICKER_LOCK:
      return Object.assign({ propsLock: action.lock });
    case ARENA_STATETREE_NODE_ADD:
      return addStateTreeNode(
        state,
        action.parentReducerKey,
        action.reducerKey,
        action.nodeType
      );
    case ARENA_STATETREE_NODE_DISABLE:
      return disableStateTreeNode(state, action.reducerKey);
    case ARENA_STATETREE_NODE_DELETE:
      return deleteStateTreeNode(state, action.reducerKey);
    default:
      return state;
  }
}
