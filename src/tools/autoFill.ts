import { ActionCreatorsMapObject } from "redux";
import { StateDict } from "../core";
import { DefaultPickedProps } from "./types";
import ActionTypes from "../ActionTypes";

export function defaultPropsPicker<S>(
  { _arenaScene: state }: StateDict<S>,
  { _arenaScene: actions }: { _arenaScene: {} }
): DefaultPickedProps<S, ActionCreatorsMapObject> {
  return Object.assign({}, state, {
    actions
  });
}

export const defaultActions = {
  setState: (state: any) => ({ type: ActionTypes.ARENA_SCENE_SET_STATE, state })
};

export const defaultReducerCreator = (defaultState: object = {}) => (
  state: any = defaultState
) => state;
