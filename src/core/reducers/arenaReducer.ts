import { AnyAction } from "redux";
import { Map, List } from "immutable";
import { actionTypes } from "../actionTypes.js";
import getArenaInitState from "./getArenaInitState";
import { ArenaState, StateTreeNode, StateTree, StateTreeDict } from "./types";

function addStateTreeNode(
  state: ArenaState,
  pReducerKey: string,
  reducerKey: string
) {
  let { stateTree, stateTreeDict } = state;
  let newStateTree, newStateTreeDict;
  let plainNewNode: StateTreeNode = {
    pReducerKey: null,
    reducerKey,
    children: Map()
  };
  let newNode = Map(plainNewNode);
  if (pReducerKey == null) {
    newStateTree = stateTree.set(reducerKey, newNode);
    newStateTreeDict = stateTreeDict.set(
      reducerKey,
      Map({ path: List([reducerKey]) })
    );
  } else {
    let pPath = stateTreeDict.getIn([pReducerKey, "path"]);
    let pNode = stateTree.getIn(pPath);
    newNode = newNode.set("pReducerKey", pNode.get("reducerKey"));
    let path = pPath.concat(["children", reducerKey]);
    let newPNode = pNode.setIn(["children", reducerKey], newNode);
    newStateTree = stateTree.setIn(pPath, newPNode);
    newStateTreeDict = stateTreeDict.set(
      reducerKey,
      Map({ path, isObsolete: false })
    );
  }
  return Object.assign({}, state, {
    stateTree: newStateTree,
    stateTreeDict: newStateTreeDict
  });
}

function getReducerKeysOfNode(
  node: Map<string, any>,
  breakChecker?: (node: Map<string, any>) => boolean
): List<string> {
  if (breakChecker && breakChecker(node)) return List();
  return node
    .get("children")
    .map((child: Map<string, any>) => getReducerKeysOfNode(child, breakChecker))
    .reduce(
      (prev: List<string>, cur: List<string>) => prev.concat(cur),
      List([node.get("reducerKey")])
    );
}

function disableStateTreeNode(state: ArenaState, reducerKey: string) {
  let { stateTreeDict, stateTree } = state;
  let path = stateTreeDict.getIn([reducerKey, "path"]);
  let node = stateTree.getIn(path);
  let obsoleteKeyList = getReducerKeysOfNode(
    node,
    node => stateTreeDict.getIn([node.get("reducerKey"), "isObsolete"]) === true
  );
  let deltaDict = Map<string, any>(
    obsoleteKeyList.map((tmpKey: string) => [
      tmpKey,
      stateTreeDict.get(tmpKey).set("isObsolete", true)
    ])
  );
  let newStateTreeDict = stateTreeDict.merge(deltaDict);
  return Object.assign({}, state, {
    stateTreeDict: newStateTreeDict
  });
}

function findNodeUpward(
  path: List<string>,
  stateTree: StateTree,
  stateTreeDict: StateTreeDict,
  checker: (node: Map<string, any>, dictItem: Map<string, any>) => boolean
): List<string> | null {
  let node = stateTree.getIn(path);
  let dictItem = stateTreeDict.get(node.get("reducerKey"));
  if (checker(node, dictItem)) {
    if (path.count() > 1) {
      let nextPath: List<string> | null = findNodeUpward(
        path.skipLast(2).toList(),
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

function deleteStateTreeNode(state: ArenaState, reducerKey: string) {
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
      let newStateTreeDict = stateTreeDict.filterNot(
        (_, key) => key === undefined || obsoleteKeyList.includes(key)
      );
      return Object.assign({}, state, {
        stateTree: newStateTree,
        stateTreeDict: newStateTreeDict
      });
    }
  }
  return state;
}

export default function reducer(
  state = getArenaInitState(),
  action: AnyAction
) {
  switch (action.type) {
    case actionTypes.ARENA_SET_STATE:
      return Object.assign({}, state, action.state);
    case actionTypes.ARENA_REPLACE_STATE:
      return Object.assign({}, action.state);
    case actionTypes.ARENA_GLOBAL_PROPSPICKER_LOCK:
      return Object.assign({ propsLock: action.lock });
    case actionTypes.ARENA_STATETREE_NODE_ADD:
      return addStateTreeNode(state, action.pReducerKey, action.reducerKey);
    case actionTypes.ARENA_STATETREE_NODE_DISABLE:
      return disableStateTreeNode(state, action.reducerKey);
    case actionTypes.ARENA_STATETREE_NODE_DELETE:
      return deleteStateTreeNode(state, action.reducerKey);
    default:
      return state;
  }
}
