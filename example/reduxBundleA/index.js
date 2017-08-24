import state from "./state";
import reducer from "./reducer";
import * as actions from "./actions";
import Page from "./Page";

export default {
  Component: Page,
  state,
  reducer,
  actions,
  mapStateToProps: function mapStateToProps(state,key) {
    return {
      pageA: state[key].pageA,
      name: state[key].name,
      dynamicState: state[key].dynamicState,
      cnt: state[key].cnt
    };
  }
};
