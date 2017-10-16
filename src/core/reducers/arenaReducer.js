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

function addStateTreeNode(state, pReducerKey, reducerKey) {
  let { stateTree, stateTreeDict } = state;
  let newStateTree, newStateTreeDict;
  let newNode = Immutable.Map({
    pReducerKey: null,
    reducerKey,
    children: Immutable.Map()
  });
  if (pReducerKey == null) {
    newStateTree = stateTree.set(reducerKey, newNode);
    newStateTreeDict = stateTreeDict.set(
      reducerKey,
      Immutable.Map({ path: Immutable.List([reducerKey]) })
    );
  } else {
    let pPath = stateTreeDict.getIn([pReducerKey, "path"]);
    let pNode = stateTree.getIn(pPath);
    newNode = newNode.set("pReducerKey", pNode.get("reducerKey"));
    let path = pPath.concat(["children", reducerKey]);
    let newPNode = pNode.setIn(["children", reducerKey], newNode);
    newStateTree = stateTree.setIn(pPath, newPNode);
    newStateTreeDict = stateTreeDict.set(reducerKey, Immutable.Map({ path }));
  }
  return Object.assign({}, state, {
    stateTree: newStateTree,
    stateTreeDict: newStateTreeDict
  });
}

function getReducerKeysOfNode(node, breakChecker) {
  if (breakChecker && breakChecker(node)) return Immutable.List();
  return node
    .get("children")
    .map(child => getReducerKeysOfNode(child, breakChecker))
    .reduce(
      (prev, cur) => prev.concat(cur),
      Immutable.List([node.get("reducerKey")])
    );
}

function disableStateTreeNode(state, reducerKey) {
  let { stateTreeDict, stateTree } = state;
  let path = stateTreeDict.getIn([reducerKey, "path"]);
  let node = stateTree.getIn(path);
  let obsoleteKeyList = getReducerKeysOfNode(
    node,
    node => stateTreeDict.getIn([node.get("reducerKey"), "isObsolete"]) === true
  );
  let deltaDict = Immutable.Map(
    obsoleteKeyList.map(tmpKey => [
      tmpKey,
      stateTreeDict.get(tmpKey).set("isObsolete", true)
    ])
  );
  let newStateTreeDict = stateTreeDict.merge(deltaDict);
  return Object.assign({}, state, {
    stateTreeDict: newStateTreeDict
  });
}

function findNodeUpward(path, stateTree, stateTreeDict, checker) {
  let node = stateTree.getIn(path);
  let dictItem = stateTreeDict.get(node.get("reducerKey"));
  if (checker(node, dictItem)) {
    if (path.count() > 1) {
      let nextPath = findNodeUpward(
        path.skipLast(2),
        stateTree,
        stateTreeDict,
        checker
      );
      return nextPath == null ? path : nextPath;
    } else {
      return path;
    }
  } else {
    return null;
  }
}

function deleteStateTreeNode(state, reducerKey) {
  let { stateTree, stateTreeDict } = state;
  let path = stateTreeDict.getIn([reducerKey, "path"]);
  let node = stateTree.getIn(path);
  if (node.get("children").count() === 0) {
    let path4Del = findNodeUpward(
      path,
      stateTree,
      stateTreeDict,
      (pNode, dictItem) =>
        dictItem.get("isObsolete") === true &&
        pNode.get("children").count() === 1
    );
    if (path4Del != null) {
      let obsoleteKeyList = getReducerKeysOfNode(stateTree.getIn(path4Del));
      let newStateTree = stateTree.deleteIn(path4Del);
      let newStateTreeDict = stateTreeDict.filterNot((_, key) =>
        obsoleteKeyList.includes(key)
      );
      return Object.assign({}, state, {
        stateTree: newStateTree,
        stateTreeDict: newStateTreeDict
      });
    }
  }
  return state;
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
      return addStateTreeNode(state, action.pReducerKey, action.reducerKey);
    case ARENA_STATETREE_NODE_DISABLE:
      return disableStateTreeNode(state, action.reducerKey);
    case ARENA_STATETREE_NODE_DELETE:
      return deleteStateTreeNode(state, action.reducerKey);
    default:
      return state;
  }
}
