import ActionTypes from "./ActionTypes";

function addPanel() {
  return {
    type: ActionTypes.ADD_PANEL
  };
}

function delPanel() {
  return {
    type: ActionTypes.DEL_PANEL
  };
}

export default { addPanel, delPanel };
