import ActionTypes from "./ActionTypes";

export function addPanel() {
  return {
    type: ActionTypes.ADD_PANEL
  };
}

export function delPanel() {
  return {
    type: ActionTypes.DEL_PANEL
  };
}
