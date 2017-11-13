import { ActionCreatorsMapObject, ActionCreator } from "redux";
import { ForkEffect } from "redux-saga/effects";
import { SceneReducer } from "../types";
import ActionTypes from "../ActionTypes";
import getCurtainInitState from "./getCurtainInitState";
import { AnyAction } from "redux";
import { CurtainState } from "./types";

function curtainReducer(
  state: CurtainState<{}>,
  action: AnyAction,
  bindedReducerKey: string
) {
  switch (action.type) {
    case ActionTypes.ARENA_CURTAIN_SET_STATE:
      return Object.assign({}, state, action.state);
    case ActionTypes.ARENA_CURTAIN_REPLACE_STATE:
      return Object.assign({}, action.state);
    default:
      return state;
  }
}

export default function createCurtainReducer(
  bindedReducerKey: string
): SceneReducer<CurtainState<{}>> {
  return function(
    state: CurtainState<{}> = getCurtainInitState(),
    action: AnyAction
  ) {
    if (bindedReducerKey === action._reducerKey) {
      state = curtainReducer(state, action, bindedReducerKey);
    }
    return state;
  };
}
