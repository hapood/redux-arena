import AnimationPhases from "./AnimationPhases";
import {
  TransitionPlainStyle,
  TransitionStyle,
  PlainStyle,
  Style
} from "react-motion";
import {
  CombinedStyleCalculator,
  StyleCalculators,
  StyleCalculator,
  NextPhaseCheckers,
  ExtendedPlainMotionStyle,
  ExtendedMotionStyle
} from "./types";

export function isCurPhaseEnd(
  prevStyles: ExtendedPlainMotionStyle[],
  isSceneReady: boolean,
  nextPhaseCheckers: NextPhaseCheckers
) {
  return prevStyles.find(styleObj => {
    let { key, style } = styleObj;
    switch (key) {
      case "container":
        return nextPhaseCheckers.container
          ? nextPhaseCheckers.container(style, isSceneReady) === true
            ? true
            : false
          : false;
      case "loadingPlay":
        return nextPhaseCheckers.loadingPlay
          ? nextPhaseCheckers.loadingPlay(style, isSceneReady) === true
            ? true
            : false
          : false;
      case "scenePlay":
        return nextPhaseCheckers.scenePlay
          ? nextPhaseCheckers.scenePlay(style, isSceneReady) === true
            ? true
            : false
          : false;
      default:
        return false;
    }
  }) == null
    ? false
    : true;
}

function calcStyle(
  style: PlainStyle,
  phase: AnimationPhases,
  calculator: StyleCalculator
): Style {
  return Object.assign({}, calculator ? calculator(style, phase) : style, {
    phase
  });
}

export function combineStyleCalculator(
  styleCalculators: StyleCalculators,
  phase: AnimationPhases,
  nextPhaseCheckers: NextPhaseCheckers,
  isSceneReady: boolean,
  nextPhase: (curPhase: AnimationPhases) => void
): CombinedStyleCalculator {
  return function(prevStyles: ExtendedPlainMotionStyle[]) {
    return <ExtendedMotionStyle[]>prevStyles.map(styleObj => {
      let { key, style } = styleObj;
      switch (key) {
        case "container":
          return {
            key: "container",
            style: calcStyle(style, phase, styleCalculators.container)
          };
        case "loadingPlay":
          return {
            key: "loadingPlay",
            style: calcStyle(style, phase, styleCalculators.loadingPlay)
          };
        case "scenePlay":
          return {
            key: "scenePlay",
            style: calcStyle(style, phase, styleCalculators.scenePlay)
          };
        case "nextPhase":
          if (isCurPhaseEnd(prevStyles, isSceneReady, nextPhaseCheckers)) {
            nextPhase(style.phase as number);
          }
          return {
            key: "nextPhase",
            style: {
              phase
            }
          };
        default:
          return styleObj;
      }
    });
  };
}
