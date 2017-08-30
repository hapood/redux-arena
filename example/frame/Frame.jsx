import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Router, Link } from "react-router-dom";
import { RouteScene, ArenaSwitch } from "redux-arena";
import scopedPageBundle from "../scopedPage";
import * as actions from "./redux/actions";
import DevTools from "./DevTools";

const AsyncPassDownBundle = import("../passDownStateAndActions");
const asyncReduxBundleC = import("../reduxBundleC");

class Frame extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {}

  render() {
    let { cnt, addCnt, clearCnt } = this.props;
    return (
      <div>
        <Router history={this.props.history}>
          <div>
            <ul>
              <li>
                <Link to="/redux-arena/emptyPage">Empty Page</Link>
              </li>
              <li>
                <Link to="/redux-arena/scopedPage">Scoped Page</Link>
              </li>
              <li>
                <Link to="/redux-arena/passDownStateAndActions">
                  Pass Down State And Actions
                </Link>
              </li>
            </ul>
            <div style={{ display: "flex" }}>
              <div style={{ marginLeft: "1rem" }}>total count: {cnt}</div>
              <button onClick={addCnt} style={{ marginLeft: "1rem" }}>
                Add Total Count
              </button>
              <button onClick={clearCnt} style={{ marginLeft: "1rem" }}>
                Clear Total Count
              </button>
            </div>
            <hr />
            <div>
              <div style={{ marginTop: "1rem" }}>
                <ArenaSwitch>
                  <RouteScene
                    path="/redux-arena/scopedPage"
                    sceneBundle={scopedPageBundle}
                  />
                  <RouteScene
                    path="/redux-arena/passDownStateAndActions"
                    asyncSceneBundle={AsyncPassDownBundle}
                  />
                </ArenaSwitch>
              </div>
            </div>
          </div>
        </Router>
        <DevTools />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

function mapStateToProps(state) {
  return { cnt: state.frame.cnt };
}

export default connect(mapStateToProps, mapDispatchToProps)(Frame);
