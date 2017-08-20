import state from "./state";
import saga from "./saga";
import Widget from "./Widget";
import * as actions from "./actions";

export default {
  Component: Widget,
  state,
  saga,
  actions,
  mapStateToProps(state, key) {
    return {
      Widget: state[key].Widget,
      name: state[key].name,
      dynamicState: state[key].dynamicState,
      cnt: state[key].cnt
    };
  }
};
