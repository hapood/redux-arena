import state from "./state";
import saga from "./saga";
import Page from "./Page";
import * as actions from "./actions";

export default {
  Component: Page,
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
