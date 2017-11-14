import { ActionCreatorsMapObject } from "redux";
import { PropsPicker, StateDict, ActionsDict } from "../types";
import {
  CurtainReduxInfo,
  CurtainMutableObj,
  RootState
} from "../reducers/types";

function getRelativeLevel(name: string) {
  let result = name.match(/^\$(\d+)$/);
  return result && parseInt(result[1]);
}

function getLevelKey(
  rootState: RootState,
  reducerKey: string,
  levelNum: number
) {
  if (levelNum === 0) return reducerKey;
  let { stateTree, stateTreeDict } = rootState.arena;
  let path = stateTreeDict.getIn([reducerKey, "path"]);
  return path.get(path.count() - 1 - 2 * levelNum);
}

export default function createPropsPicker<
  S,
  A extends ActionCreatorsMapObject,
  P
>(
  propsPicker: PropsPicker<P, S, A, Partial<P>>,
  reduxInfo: CurtainReduxInfo<S>,
  mutableObj: CurtainMutableObj
) {
  let { arenaReducerDict } = reduxInfo;
  let sceneReducerKey = arenaReducerDict._arenaScene.reducerKey;
  let latestProps: Partial<P>;
  let stateHandler = {
    get: function(target: { state: any }, name: string) {
      let levelNum = getRelativeLevel(name);
      if (levelNum != null) {
        name = getLevelKey(target.state, sceneReducerKey, levelNum);
      }
      let dictItem = arenaReducerDict[name];
      if (dictItem == null) return null;
      return target.state[dictItem.reducerKey];
    }
  };
  let actionsHandler = {
    get: function(target: { state: any }, name: string) {
      let levelNum = getRelativeLevel(name);
      if (levelNum != null) {
        name = getLevelKey(target.state, sceneReducerKey, levelNum);
      }
      let dictItem = arenaReducerDict[name];
      if (dictItem == null) return null;
      return dictItem.actions;
    }
  };
  let stateObj = { state: null };
  let stateDict: StateDict<S> = new Proxy(stateObj, stateHandler) as any;
  let actionsDict: ActionsDict<A> = new Proxy(stateObj, actionsHandler) as any;
  return (state: any) => {
    stateObj.state = state;
    if (
      mutableObj.isObsolete === true ||
      state.arena.propsLock !== false ||
      state.arena.stateTreeDict.getIn([sceneReducerKey, "isObsolete"]) === true
    ) {
      return latestProps;
    } else {
      latestProps = propsPicker(stateDict, actionsDict);
      return latestProps;
    }
  };
}
