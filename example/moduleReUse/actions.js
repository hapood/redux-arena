import { ADD_PANEL, DEL_PANEL } from "./actionTypes";

export function addPanel() {
  return {
    type: ADD_PANEL
  };
}

export function delPanel() {
  return {
    type: DEL_PANEL
  };
}
