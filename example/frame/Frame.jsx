import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Router, Link } from "react-router-dom";
import { PublicScene, SceneSwitch } from "redux-arena";
import { IndependentScene } from "../../src";
import reduxBundleA from "../reduxBundleA";
import * as actions from "./redux/actions";
import DevTools from "./DevTools";

const asyncReduxBundleB = import("../reduxBundleB");
const asyncReduxBundleC = import("../reduxBundleC");

class Frame extends Component {
  componentWillMount() {
    this.state = { showWidget: false };
  }

  render() {
    return (
      <div>
        <Router history={this.props.history}>
          <div>
            <ul>
              <li>
                <Link to="/pageA">pageA</Link>
              </li>
              <li>
                <Link to="/asyncPageB">asyncPageB</Link>
              </li>
            </ul>
            <hr />
            <button
              onClick={() =>
                this.setState({ showWidget: !this.state.showWidget })}
            >
              {this.state.showWidget ? "hideWidget" : "showWidget"}
            </button>
            <div style={{ marginTop: "1rem" }}>
              <SceneSwitch>
                <PublicScene path="/pageA" sceneBundle={reduxBundleA} />
                <PublicScene
                  path="/asyncPageB"
                  asyncSceneBundle={asyncReduxBundleB}
                />
              </SceneSwitch>
              {this.state.showWidget
                ? <IndependentScene asyncSceneBundle={asyncReduxBundleC} />
                : null}
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
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Frame);
