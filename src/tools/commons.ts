import { StateDict } from "../core";
import { DefaultPickedProps } from "./types";

export function defaultPropsPicker<S>(
  { _arenaScene: state }: StateDict<S>,
  { _arenaScene: actions }: { _arenaScene: {} }
): DefaultPickedProps<S> {
  return Object.assign({}, state, {
    actions
  });
}

const defaultActions = {
  setState: (state: any) => ({ type: ActionTypes.ARENA_SCENE_SET_STATE, state })
};
