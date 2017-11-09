import { ActionCreatorsMapObject } from "redux";
import { PropsPicker } from "../types";
import { CurtainReduxInfo, CurtainMutableObj } from "../reducers/types";

function defaultPropsPicker(
  { _arenaScene: state }: { _arenaScene: {} },
  { _arenaScene: actions }: { _arenaScene: {} }
) {
  return Object.assign({}, state, {
    actions
  });
}

export type DefaultPickedProps<S> = {
  actions: { [key: string]: (...params: any[]) => void };
} & { [K in keyof S]: S[K] };

export default function propsPicker<P, S>(
  propsPicker: PropsPicker<P | DefaultPickedProps<S>> = defaultPropsPicker,
  reduxInfo: CurtainReduxInfo<S>,
  mutableObj: CurtainMutableObj
) {
  let { arenaReducerDict } = reduxInfo;
  let sceneReducerKey = arenaReducerDict._arenaScene.reducerKey;
  let latestProps: Partial<P> | Partial<DefaultPickedProps<S>>;
  let stateHandler = {
    get: function(target: { state: any }, name: string) {
      return (
        arenaReducerDict[name] &&
        target.state[arenaReducerDict[name].reducerKey]
      );
    }
  };
  let actionsHandler = {
    get: function(target: { state: any }, name: string) {
      return arenaReducerDict[name] && arenaReducerDict[name].actions;
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
