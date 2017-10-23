import React, { Component } from "react";
import PropTypes from "prop-types";
import { ArenaSceneLoadMotion } from "redux-arena";
import { bundleToElement } from "redux-arena/tools";
import LoadingPage from "./LoadingPage";
import * as sceneAnimation from "./sceneAnimation";

export default class AsyncLoadHOC extends Component {
  static propTypes = {
    sceneBundleThunk: PropTypes.func.isRequired
  };
  render() {
    return (
      <div style={{ width: "400px", height: "400px", position: "relative" }}>
        <ArenaSceneLoadMotion
          sceneBundleThunk={this.props.sceneBundleThunk}
          loadingPlay={<LoadingPage />}
          initStyles={sceneAnimation.initStyles}
          styleCalculators={sceneAnimation.styleCalculators}
          numberToStyles={sceneAnimation.numberToStyles}
          nextPhaseCheckers={sceneAnimation.nextPhaseCheckers}
        >
          {bundle => bundleToElement(bundle)}
        </ArenaSceneLoadMotion>
      </div>
    );
  }
}
