import { StateDict } from "../core";
import { DefaultPickedProps } from "./types";
import ActionTypes from "../ActionTypes";

export function defaultPropsPicker<S>(
  { _arenaScene: state }: StateDict<S>,
  { _arenaScene: actions }: { _arenaScene: {} }
): DefaultPickedProps<S, { setState: (state: Partial<S>) => void }> {
  return Object.assign({}, state, {
    actions: defaultActions
  });
}

export const defaultActions = {
  setState: (state: any) => ({ type: ActionTypes.ARENA_SCENE_SET_STATE, state })
};

export const defaultReducer = (state: any) => state;
