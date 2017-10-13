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

function addStateTreeNode(state, parentReducerKey, reducerKey) {
  let { stateTree, stateTreeDict } = state;
  let newStateTree, newStateTreeDict;
  let newNode = Immutable.Map({
    isDisabled: false,
    pReducerKey: null,
    reducerKey,
    children: Immutable.Map()
  });
  if (parentReducerKey == null) {
    newStateTree = newStateTree.set(reducerKey, newNode);
    newStateTreeDict = stateTreeDict.set(reducerKey, newNode);
  } else {
    let parentNode = newStateTreeDict.get(parentReducerKey);
    newNode = newNode.set("pReducerKey", parentNode.get("reducerKey"));
    let newParentNode = parentNode.setIn(["children", reducerKey], newNode);
    newStateTree = stateTreeDict.setIn(
      getFullPath(newParentNode, newStateTreeDict),
      newParentNode
    );
    newStateTreeDict = newStateTreeDict.merge({
      [parentReducerKey]: newParentNode,
      [reducerKey]: newNode
    });
  }
  return Object.assign({}, state, {
    stateTree: newStateTree,
    stateTreeDict: newStateTreeDict
  });
}

function getReducerKeysCasade(node, breakChecker) {
  if (breakChecker && breakChecker(node)) return Immutable.List();
  return node.children
    .map(child =>
      getReducerKeysCasade(child, breakChecker).concat(child.get("reducerKey"))
    )
    .reduce((prev, cur) => prev.concat(cur), Immutable.List())
    .concat(node.get("reducerKey"));
}

function disableStateTreeNode(state, reducerKey) {
  let { stateTreeDict } = state;
  let curNode = stateTreeDict.get(reducerKey);
  let reducerKeyList = getReducerKeysCasade(
    curNode,
    node => stateTreeDict.getIn([node.get("reducerKey"), "isObsolete"]) === true
  );
  let deltaDict = Immutable.Map(
    reducerKeyList.map(tmpKey => [
      reducerKey,
      stateTreeDict.get(tmpKey).set("isObsolete", true)
    ])
  );
  let newStateTreeDict = stateTreeDict.merge(deltaDict);
  return Object.assign({}, state, {
    stateTreeDict: newStateTreeDict
  });
}

function findParent(node, stateTreeDict, checker) {
  let pNode = stateTreeDict.get(node.get("pReducerKey"));
  if (pNode == null) return node;
  if (checker(pNode)) {
    return findParent(pNode, stateTreeDict, checker);
  } else {
    return node;
  }
}

function deleteStateTreeNode(state, reducerKey) {
  let curNode = newStateTreeDict.get(reducerKey);
  if (curNode.get("children").count === 0) {
    let { stateTree, stateTreeDict } = state;
    let node4Delete = findParent(
      node,
      stateTreeDict,
      pNode =>
        stateTreeDict.getIn([pNode.get("reducerKey"), "isObsolete"]) === true &&
        parentNode.get("children").count() === 1
    );
    let pFullPath = getFullPath(node4Delete, stateTreeDict);
    let reducerKeyList = getReducerKeysCasade(node4Delete, stateTreeDict);
    let newStateTree = stateTree.deleteIn(pFullPath);
    let newStateTreeDict = stateTreeDict.deleteAll(reducerKeyList);
    return Object.assign({}, state, {
      stateTree: newStateTree,
      stateTreeDict: newStateTreeDict
    });
  } else {
    return state;
  }
}

export default function reducer(state = getArenaInitState(), action) {
  switch (action.type) {
    case ARENA_SET_STATE:
      return Object.assign({}, state, action.state);
    case ARENA_REPLACE_STATE:
      return Object.assign({}, action.state);
    case ARENA_GLOBAL_PROPSPICKER_LOCK:
      return Object.assign({ propsLock: action.lock });
    // case ARENA_STATETREE_NODE_ADD:
    //   return addStateTreeNode(
    //     state,
    //     action.parentReducerKey,
    //     action.reducerKey
    //   );
    // case ARENA_STATETREE_NODE_DISABLE:
    //   return disableStateTreeNode(state, action.reducerKey);
    // case ARENA_STATETREE_NODE_DELETE:
    //   return deleteStateTreeNode(state, action.reducerKey);
    default:
      return state;
  }
}
