import { ENTERING, IN, LEAVING, OUT } from "./animationPhase";
export function isCurPhaseEnd(prevStyles, isSceneReady, nextPhaseCheckers) {
  return prevStyles.find(styleObj => {
    let { key, style } = styleObj;
    switch (key) {
      case "container":
        return nextPhaseCheckers.container
          ? nextPhaseCheckers.container(style, isSceneReady)
          : false;
      case "loadingPlay":
        return nextPhaseCheckers.loadingPlay
          ? nextPhaseCheckers.loadingPlay(style, isSceneReady)
          : false;
      case "scenePlay":
        return nextPhaseCheckers.scenePlay
          ? nextPhaseCheckers.scenePlay(style, isSceneReady)
          : false;
      default:
        return false;
    }
  }) == null
    ? false
    : true;
}

function calcStyle(style, phase, calculator) {
  return Object.assign({}, calculator ? calculator(style, phase) : style, {
    phase
  });
}

export function buildStyleCalculator(
  styleCalculators,
  phase,
  nextPhaseCheckers,
  isSceneReady,
  nextPhase
) {
  return function(prevStyles) {
    return prevStyles.map(styleObj => {
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
            nextPhase(style.phase);
          }
          return {
            key: "nextPhase",
            style: {
              phase,
              isSceneReady
            }
          };
          return styleObj;
        default:
          return styleObj;
      }
    });
  };
}
