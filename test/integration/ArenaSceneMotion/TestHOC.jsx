import React, { Component } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { ArenaSceneMotion } from "src";
import * as sceneAnimation from "./sceneAnimation";

export default class TestHOC extends Component {
  static propTypes = {
    store: PropTypes.any.isRequired,
    children: PropTypes.element
  };
  render() {
    let props = this.props;
    return (
      <Provider store={props.store}>
        <ArenaSceneMotion
          loadingPlay={<div />}
          initStyles={sceneAnimation.initStyles}
          styleCalculators={sceneAnimation.styleCalculators}
          numberToStyle={sceneAnimation.numberToStyle}
          nextPhaseCheckers={sceneAnimation.nextPhaseCheckers}
        >
          {this.props.children}
        </ArenaSceneMotion>
      </Provider>
    );
  }
}
