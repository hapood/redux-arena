import state from "./state";
import saga from "./saga";
import Widget from "./Widget";
import reducer from "./reducer";
import * as actions from "./actions";
export default {
  Component: Widget,
  state,
  saga,
  actions,
  reducer,
  mapStateToProps(state, key) {
    return {
      Widget: state[key].Widget,
      name: state[key].name,
      dynamicState: state[key].dynamicState,
      cnt: state[key].cnt,
      isDynamicStateEnable: state[key].isDynamicStateEnable
    };
  }
};
