import React, { Component } from "react";
import PropTypes from "prop-types";
import { TransitionMotion } from "react-motion";
import { LOADING } from "./animationPhase";
import { buildStyleCalculator, isCurPhaseEnd } from "./utils";

export default class ArenaSceneLoadMotion extends Component {
  static propTypes = {
    loadingPlay: PropTypes.element.isRequired,
    asyncBundleThunk: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
    initStyles: PropTypes.array.isRequired,
    styleCalculators: PropTypes.object.isRequired,
    nextPhaseCheckers: PropTypes.object.isRequired,
    numberToStyle: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.actions.loadSceneBundle(this.props.asyncBundleThunk);
    this.setState({
      initStyles: this.props.initStyles
        .map(styleObj =>
          Object.assign({}, styleObj, {
            style: Object.assign({}, styleObj.style, { phase: LOADING })
          })
        )
        .concat({
          key: "nextPhase",
          style: { phase: LOADING }
        }),
      styleCalculator: buildStyleCalculator(
        this.props.styleCalculators,
        this.props.phase,
        this.props.nextPhaseCheckers,
        this.props.isSceneReady,
        phase => setImmediate(() => this.props.actions.nextPhase(phase))
      ),
      playElement: this.props.bundle
        ? this.props.children(this.props.bundle)
        : null
    });
  }

  componentWillReceiveProps(nextProps) {
    let state = Object.assign({}, state);
    if (
      this.props.bundle !== nextProps.bundle ||
      this.props.children !== nextProps.children
    ) {
      state.playElement = nextProps.bundle
        ? nextProps.children(nextProps.bundle)
        : null;
    }
    if (nextProps.asyncBundleThunk !== this.props.asyncBundleThunk) {
      nextProps.actions.loadSceneBundle(nextProps.asyncBundleThunk);
    }
    if (
      nextProps.actions !== this.props.actions ||
      nextProps.phase !== this.props.phase ||
      nextProps.styleCalculators !== this.props.styleCalculators ||
      nextProps.nextPhaseCheckers !== this.props.nextPhaseCheckers ||
      nextProps.isSceneReady !== this.props.isSceneReady
    ) {
      state.styleCalculator = buildStyleCalculator(
        nextProps.styleCalculators,
        nextProps.phase,
        nextProps.nextPhaseCheckers,
        nextProps.isSceneReady,
        phase => setImmediate(() => nextProps.actions.nextPhase(phase))
      );
    }
    if (nextProps.initStyles !== this.props.initStyles) {
      let nextPhaseStyle = state.initStyles.find(
        style => style.key === "nextPhase"
      );
      state.initStyles = nextProps.initStyles.concat(nextPhaseStyle);
    }
    this.setState(state);
  }

  render() {
    let { phase, numberToStyle, isSceneReady } = this.props;
    return (
      <TransitionMotion
        defaultStyles={this.state.initStyles}
        willLeave={this.willLeave}
        styles={this.state.styleCalculator}
      >
        {interpolatedStyles => {
          let containerStyle, scenePlayStyle, loadingPlayStyle, animationPhase;
          interpolatedStyles.forEach(styleObj => {
            let { key, style } = styleObj;
            switch (key) {
              case "container":
                containerStyle = style;
                break;
              case "loadingPlay":
                loadingPlayStyle = style;
                break;
              case "scenePlay":
                scenePlayStyle = style;
                break;
              case "nextPhase":
                animationPhase = style.phase;
                break;
            }
          });
          return (
            <div
              style={numberToStyle(
                "container",
                containerStyle,
                animationPhase,
                isSceneReady
              )}
            >
              <div
                key="loadingPlay"
                style={numberToStyle(
                  "loadingPlay",
                  loadingPlayStyle,
                  animationPhase,
                  isSceneReady
                )}
              >
                {this.props.loadingPlay}
              </div>
              <div
                key="scenePlay"
                style={numberToStyle(
                  "scenePlay",
                  scenePlayStyle,
                  animationPhase,
                  isSceneReady
                )}
              >
                {this.state.playElement}
              </div>
            </div>
          );
        }}
      </TransitionMotion>
    );
  }
}
