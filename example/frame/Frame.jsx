import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Router, Link } from "react-router-dom";
import { RouteScene, ArenaSwitch, SoloScene } from "../../src";
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
      showArenaSwitch: true
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
                this.state.showArenaSwitch
                  ? "hideArenaSwitch"
                  : "showArenaSwitch"
              }
              onClick={() =>
                this.setState({ showArenaSwitch: !this.state.showArenaSwitch })}
            />
            <div style={{ marginTop: "1rem" }}>
              {this.state.showArenaSwitch
                ? <ArenaSwitch reducerKey={this.state.reducerKey}>
                    <RouteScene path="/pageA" sceneBundle={reduxBundleA} />
                    <RouteScene
                      path="/asyncPageB"
                      asyncSceneBundle={asyncReduxBundleB}
                    />
                  </ArenaSwitch>
                : null}
              {this.state.showWidget
                ? <SoloScene asyncSceneBundle={asyncReduxBundleC} />
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
