import state from "./state";
import saga from "./saga";
import PageB from "./PageB";
import * as actions from "./actions";

export default {
  Component: PageB,
  state,
  saga,
  actions,
  mapStateToProps(state, key) {
    return {
      pageB: state[key].pageB,
      name: state[key].name,
      dynamicState: state[key].dynamicState,
      cnt: state[key].cnt
    };
  }
};
