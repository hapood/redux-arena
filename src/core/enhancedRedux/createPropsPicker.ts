import { ActionCreatorsMapObject } from "redux";
import { PropsPicker } from "../types";
import { CurtainReduxInfo, CurtainMutableObj } from "../reducers/types";

function defaultPropsPicker(
  sceneState: any,
  sceneActions: ActionCreatorsMapObject
) {
  return Object.assign({}, sceneState, {
    actions: sceneActions
  });
}

export default function createPropsPicker<P, S>(
  propsPicker: PropsPicker<S, any, any> = defaultPropsPicker,
  reduxInfo: CurtainReduxInfo<S>,
  mutableObj: CurtainMutableObj
) {
  let { arenaReducerDict } = reduxInfo;
  let sceneReducerKey = arenaReducerDict._arenaScene.reducerKey;
  let sceneActions = arenaReducerDict._arenaScene.actions;
  let latestProps: P;
  return (state: any) => {
    if (
      mutableObj.isObsolete === true ||
      state.arena.propsLock !== false ||
      state.arena.stateTreeDict.getIn([sceneReducerKey, "isObsolete"]) === true
    ) {
      return latestProps;
    } else {
      latestProps = propsPicker(
        state[sceneReducerKey],
        sceneActions,
        state,
        arenaReducerDict
      );
      return latestProps;
    }
  };
}
