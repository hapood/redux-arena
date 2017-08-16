import state from "./state";
import saga from "./saga";
import reducer from "./reducer";
import * as actions from "./actions";
import PageA from "./PageA";

export default {
  Component: PageA,
  state,
  saga,
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
