import {
  AnyAction,
  Dispatch,
  ActionCreatorsMapObject,
  ActionCreator
} from "redux";
import { RootState } from "../reducers/types";
function bindArenaActionCreator(
  actionCreator: ActionCreator<AnyAction>,
  dispatch: Dispatch<RootState>,
  sceneReducerKey: string
) {
  return (...args: any[]) => {
    let action = actionCreator(...args);
    if (action && action._sceneReducerKey) {
      console.warn(
        '"Action with redux-arena should not contain an user specified "_sceneReducerKey" property.\n' +
          `Occurred in type: ${action.type}, _sceneReducerKey: ${
            sceneReducerKey
          }.`
      );
    }
    typeof action === "object"
      ? dispatch(
          Object.assign({}, { _sceneReducerKey: sceneReducerKey }, action)
        )
      : dispatch(action);
  };
}

export default function bindArenaActionCreators<
  M extends ActionCreatorsMapObject
>(
  actionCreators: ActionCreatorsMapObject,
  dispatch: Dispatch<RootState>,
  sceneReducerKey: string
): M {
  if (
    typeof actionCreators === "function" ||
    typeof actionCreators !== "object" ||
    actionCreators === null
  ) {
    throw new Error(
      `bindArenaActionCreators expected an object, instead received ${
        actionCreators === null ? "null" : typeof actionCreators
      }. ` +
        `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    );
  }

  let keys = Object.keys(actionCreators);
  let bindedActionCreators: M = <M>{};
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      bindedActionCreators[key] = bindArenaActionCreator(
        actionCreator,
        dispatch,
        sceneReducerKey
      );
    }
  }
  return bindedActionCreators;
}
