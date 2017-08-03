import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReduxArena from "./ReduxArena";
import * as actions from "./redux/actions";

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(null, mapDispatchToProps)(ReduxArena);
