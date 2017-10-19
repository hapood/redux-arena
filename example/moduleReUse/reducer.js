import initState from "./state";
import { ADD_PANEL, DEL_PANEL } from "./ActionTypes";

export default function reducer(state = initState, action) {
  let newPanelNum;
  switch (action.type) {
    case ADD_PANEL:
      newPanelNum = state.panelNum + 1;
      return Object.assign({}, state, {
        panelNum: newPanelNum > 10 ? 10 : newPanelNum
      });
    case DEL_PANEL:
      newPanelNum = state.panelNum - 1;
      return Object.assign({}, state, {
        panelNum: newPanelNum < 0 ? 0 : newPanelNum
      });
    default:
      return state;
  }
}