import React, { Component } from "react";
import PropTypes from "prop-types";
import { TransitionMotion } from "react-motion";
import { LOADING, ENTERING, IN, LEAVING, OUT } from "../../animationPhase";
import { buildStyleCalculator, isCurPhaseEnd } from "./utils";

export default class ArenaSceneAnimation extends Component {
  static propTypes = {
    loadingPlay: PropTypes.element.isRequired,
    children: PropTypes.element.isRequired,
    defaultStyles: PropTypes.array.isRequired,
    styleCalculators: PropTypes.object.isRequired,
    nextPhaseCheckers: PropTypes.object.isRequired,
    numberToStyle: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.state = {
      scenePlay: React.cloneElement(this.props.children, {
        isNotifyOn: true,
        notifyData: Object.assign({}, this.props.children, {
          _toReducerKey: this.props.reducerKey
        })
      })
    };
    this.props.actions.playNext();
    this.state = {
      defaultStyles: this.props.defaultStyles.concat({
        key: "nextPhase",
        style: { phase: LOADING }
      })
    };
    this.state.styleCalculator = buildStyleCalculator(
      this.props.phase,
      this.props.styleCalculators,
      this.props.nextPhaseCheckers,
      this.props.isSceneReady,
      () => setImmediate(() => this.props.actions.nextPhase(this.props.phase))
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.state.scenePlay = React.cloneElement(this.props.children, {
        isNotifyOn: true,
        notifyData: Object.assign({}, this.props.children, {
          _toReducerKey: this.props.reducerKey
        })
      });
    }
    if (
      nextProps.actions !== this.props.actions ||
      nextProps.phase !== this.props.phase ||
      nextProps.styleCalculators !== this.props.styleCalculators ||
      nextProps.nextPhaseCheckers !== this.props.nextPhaseCheckers ||
      nextProps.isSceneReady !== this.props.isSceneReady
    ) {
      this.state.styleCalculator = buildStyleCalculator(
        nextProps.phase,
        nextProps.styleCalculators,
        nextProps.nextPhaseCheckers,
        nextProps.props.isSceneReady,
        () => setImmediate(() => nextProps.actions.nextPhase(this.props.phase))
      );
    }
    if (nextProps.defaultStyles !== this.props.defaultStyles) {
      let nextPhaseStyle = this.state.defaultStyles.find(
        style => style.key === "nextPhase"
      );
      this.state.defaultStyles = nextProps.defaultStyles.concat(nextPhaseStyle);
    }
  }

  render() {
    let { phase, numberToStyle } = this.props;
    return (
      <TransitionMotion
        defaultStyles={this.state.defaultStyles}
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
              style={numberToStyle("container", containerStyle, animationPhase)}
            >
              {animationPhase === IN ||
              animationPhase === LEAVING ||
              animationPhase === OUT ? null : (
                <div
                  key="loadingPlay"
                  style={numberToStyle(
                    "loadingPlay",
                    loadingPlayStyle,
                    animationPhase
                  )}
                >
                  {this.props.loadingPlay}
                </div>
              )}
              {animationPhase === OUT ? null : (
                <div
                  key="scenePlay"
                  style={numberToStyle(
                    "scenePlay",
                    scenePlayStyle,
                    animationPhase
                  )}
                >
                  {this.state.scenePlay}
                </div>
              )}
            </div>
          );
        }}
      </TransitionMotion>
    );
  }
}
