import { ActionCreatorsMapObject } from "redux";
import { PropsPicker, ConnectedAction } from "../types";
import { CurtainReduxInfo, CurtainMutableObj } from "../reducers/types";

function defaultPropsPicker<S>(
  { _arenaScene: state }: { _arenaScene: S },
  { _arenaScene: actions }: { _arenaScene: {} }
): DefaultPickedProps<S> {
  return Object.assign({}, state, {
    actions
  });
}

export type DefaultPickedProps<S> = {
  actions: Record<string, ConnectedAction>;
} & S;

export default function createPropsPicker<S, P = DefaultPickedProps<S>>(
  propsPicker: PropsPicker<P, Partial<P>> = defaultPropsPicker,
  reduxInfo: CurtainReduxInfo<S>,
  mutableObj: CurtainMutableObj
) {
  let { arenaReducerDict } = reduxInfo;
  let sceneReducerKey = arenaReducerDict._arenaScene.reducerKey;
  let latestProps: Partial<P> | Partial<DefaultPickedProps<S>>;
  let stateHandler = {
    get: function(target: { state: any }, name: string) {
      let dictItem = arenaReducerDict[name];
      if (dictItem == null) return null;
      return target.state[dictItem.reducerKey];
    }
  };
  let actionsHandler = {
    get: function(target: { state: any }, name: string) {
      let dictItem = arenaReducerDict[name];
      if (dictItem == null) return null;
      return dictItem.actions;
    }
  };
  let stateObj = { state: null };
  let stateDict = new Proxy(stateObj, stateHandler);
  let actionsDict = new Proxy(stateObj, actionsHandler);
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
