import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Router, Link } from "react-router-dom";
import { PublicScene, SceneSwitch, IndependentScene } from "../../src";
import reduxBundleA from "../reduxBundleA";
import * as actions from "./redux/actions";
import DevTools from "./DevTools";

const asyncReduxBundleB = import("../reduxBundleB");
const asyncReduxBundleC = import("../reduxBundleC");
class Frame extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    // this.state.showWidget = false;
    this.state = {
      showWidget: false,
      reducerKey: "fkdsjfkdj",
      showSenceSwitch: true
    };
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
            <input
              type="button"
              value="reducerKey"
              onClick={() =>
                this.setState({ reducerKey: this.state.reducerKey + "re" })}
            />
            <input
              type="button"
              value={
                this.state.showSenceSwitch
                  ? "hideSenceSwitch"
                  : "showSenceSwitch"
              }
              onClick={() =>
                this.setState({ showSenceSwitch: !this.state.showSenceSwitch })}
            />
            <div style={{ marginTop: "1rem" }}>
              {this.state.showSenceSwitch
                ? <SceneSwitch reducerKey={this.state.reducerKey}>
                    <PublicScene path="/pageA" sceneBundle={reduxBundleA} />
                    <PublicScene
                      path="/asyncPageB"
                      asyncSceneBundle={asyncReduxBundleB}
                    />
                  </SceneSwitch>
                : null}
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
