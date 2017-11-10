import { ActionCreatorsMapObject } from "redux";
import { PropsPicker, ConnectedAction, StateDict, ActionsDict } from "../types";
import {
  CurtainReduxInfo,
  CurtainMutableObj,
  RootState
} from "../reducers/types";

function defaultPropsPicker<S>(
  { _arenaScene: state }: StateDict<S>,
  { _arenaScene: actions }: { _arenaScene: {} }
): DefaultPickedProps<S> {
  return Object.assign({}, state, {
    actions
  });
}

function getRelativeLevel(name: string) {
  let result = name.match(/^\$(\d+)$/);
  return result && parseInt(result[1]);
}

function getLevelState(
  rootState: RootState,
  reducerKey: string,
  levelNum: number
) {
  if (levelNum === 0) return rootState[reducerKey];
  let { stateTree, stateTreeDict } = rootState.arena;
  let path = stateTreeDict
    .getIn([reducerKey, "path"])
    .skipLast(2 * levelNum)
    .toList();
  return stateTree.getIn(path);
}

export type DefaultPickedProps<S> = {
  actions: Record<string, ConnectedAction>;
} & S;

export default function createPropsPicker<S, P = DefaultPickedProps<S>>(
  propsPicker: PropsPicker<P, S, Partial<P>> = defaultPropsPicker,
  reduxInfo: CurtainReduxInfo<S>,
  mutableObj: CurtainMutableObj
) {
  let { arenaReducerDict } = reduxInfo;
  let sceneReducerKey = arenaReducerDict._arenaScene.reducerKey;
  let latestProps: Partial<P> | Partial<DefaultPickedProps<S>>;
  let stateHandler = {
    get: function(target: { state: any }, name: string) {
      let levelNum = getRelativeLevel(name);
      if (levelNum != null) {
        return getLevelState(target.state, sceneReducerKey, levelNum);
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
        return getLevelState(target.state, sceneReducerKey, levelNum);
      }
      let dictItem = arenaReducerDict[name];
      if (dictItem == null) return null;
      return dictItem.actions;
    }
  };
  let stateObj = { state: null };
  let stateDict: StateDict<S> = new Proxy(stateObj, stateHandler) as any;
  let actionsDict: ActionsDict = new Proxy(stateObj, actionsHandler);
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
