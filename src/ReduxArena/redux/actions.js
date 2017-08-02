import { ARENA_SET_STATE } from "../../redux/actionTypes";

export function setArenaHistory(history) {
  return {
    type: ARENA_SET_STATE,
    state: { history }
  };
}
