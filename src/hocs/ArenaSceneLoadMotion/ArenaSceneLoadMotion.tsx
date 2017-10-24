import * as React from "react";
import { TransitionMotion } from "react-motion";
import AnimationPhases from "./AnimationPhases";
import { combineStyleCalculator, isCurPhaseEnd } from "./utils";
import {
  ArenaSceneLoadMotionProps,
  ArenaSceneLoadMotionConnectedProps,
  ExtendedMotionStyle,
  CombinedStyleCalculator
} from "./types";

export type InnerState = {
  initStyles: ExtendedMotionStyle[];
  styleCalculator: CombinedStyleCalculator;
  playElement: React.ReactElement<{}> | null;
};

export default class ArenaSceneLoadMotion extends React.Component<
  ArenaSceneLoadMotionProps & ArenaSceneLoadMotionConnectedProps,
  InnerState
> {
  componentWillMount() {
    this.props.actions.loadSceneBundle(this.props.sceneBundleThunk);
    this.setState({
      initStyles: (this.props.initStyles as ExtendedMotionStyle[]).concat([
        {
          key: "nextPhase",
          style: { phase: AnimationPhases.LOADING }
        }
      ]),
      styleCalculator: combineStyleCalculator(
        this.props.styleCalculators,
        this.props.phase,
        this.props.nextPhaseCheckers,
        this.props.isSceneReady,
        (phase: AnimationPhases) =>
          setImmediate(() => this.props.actions.nextPhase(phase))
      ),
      playElement: this.props.bundle
        ? this.props.children(this.props.bundle)
        : null
    });
  }

  componentWillReceiveProps(
    nextProps: ArenaSceneLoadMotionProps & ArenaSceneLoadMotionConnectedProps
  ) {
    let state: InnerState = Object.assign({}, this.state);
    if (
      this.props.bundle !== nextProps.bundle ||
      this.props.children !== nextProps.children
    ) {
      state.playElement = nextProps.bundle
        ? nextProps.children(nextProps.bundle)
        : null;
    }
    if (nextProps.sceneBundleThunk !== this.props.sceneBundleThunk) {
      nextProps.actions.loadSceneBundle(nextProps.sceneBundleThunk);
    }
    if (
      nextProps.actions !== this.props.actions ||
      nextProps.phase !== this.props.phase ||
      nextProps.styleCalculators !== this.props.styleCalculators ||
      nextProps.nextPhaseCheckers !== this.props.nextPhaseCheckers ||
      nextProps.isSceneReady !== this.props.isSceneReady
    ) {
      state.styleCalculator = combineStyleCalculator(
        nextProps.styleCalculators,
        nextProps.phase,
        nextProps.nextPhaseCheckers,
        nextProps.isSceneReady,
        phase => setImmediate(() => nextProps.actions.nextPhase(phase))
      );
    }
    if (nextProps.initStyles !== this.props.initStyles) {
      let nextPhaseStyle: any = state.initStyles.find(
        style => style.key === "nextPhase"
      );
      if (nextPhaseStyle) {
        state.initStyles = (nextProps.initStyles as ExtendedMotionStyle[]).concat(
          [nextPhaseStyle]
        );
      }
    }
    this.setState(state);
  }

  render() {
    let { phase, numberToStyles, isSceneReady } = this.props;
    let { initStyles, styleCalculator } = this.state;
    return (
      <TransitionMotion defaultStyles={initStyles} styles={styleCalculator}>
        {interpolatedStyles => {
          let containerStyle, scenePlayStyle, loadingPlayStyle;
          let animationPhase: AnimationPhases = (interpolatedStyles.find(
            styleObj => styleObj.key === "nextPhase"
          ) as any).style.phase;
          interpolatedStyles.forEach(styleObj => {
            let { key, style } = styleObj;
            switch (key) {
              case "container":
                containerStyle = numberToStyles.container(
                  style,
                  animationPhase,
                  isSceneReady
                );
                break;
              case "loadingPlay":
                loadingPlayStyle = numberToStyles.loadingPlay(
                  style,
                  animationPhase,
                  isSceneReady
                );
                break;
              case "scenePlay":
                scenePlayStyle = numberToStyles.scenePlay(
                  style,
                  animationPhase,
                  isSceneReady
                );
                break;
            }
          });
          return (
            <div style={containerStyle}>
              <div key="loadingPlay" style={loadingPlayStyle}>
                {this.props.loadingPlay}
              </div>
              <div key="scenePlay" style={scenePlayStyle}>
                {this.state.playElement}
              </div>
            </div>
          );
        }}
      </TransitionMotion>
    );
  }
}
