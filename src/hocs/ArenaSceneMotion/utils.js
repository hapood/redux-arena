import { ENTERING, IN, LEAVING, OUT } from "./animationPhase";
export function isCurPhaseEnd(
  prevStyles,
  phase,
  isSceneReady,
  nextPhaseCheckers
) {
  return prevStyles.find(styleObj => {
    let { key, style } = styleObj;
    switch (key) {
      case "container":
        return nextPhaseCheckers.container
          ? nextPhaseCheckers.container(style, phase, isSceneReady)
          : false;
      case "loadingPlay":
        return nextPhaseCheckers.loadingPlay
          ? nextPhaseCheckers.loadingPlay(style, phase, isSceneReady)
          : false;
      case "scenePlay":
        return nextPhaseCheckers.scenePlay
          ? nextPhaseCheckers.scenePlay(style, phase, isSceneReady)
          : false;
      default:
        return false;
    }
  }) == null
    ? false
    : true;
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
            style: styleCalculators.container
              ? styleCalculators.container(style, phase, isSceneReady)
              : style
          };
        case "loadingPlay":
          return {
            key: "loadingPlay",
            style: styleCalculators.loadingPlay
              ? styleCalculators.loadingPlay(style, phase, isSceneReady)
              : style
          };
        case "scenePlay":
          return {
            key: "scenePlay",
            style: styleCalculators.scenePlay
              ? styleCalculators.scenePlay(style, phase, isSceneReady)
              : style
          };
        case "nextPhase":
          if (phase === IN) {
            return {
              key: "nextPhase",
              style: {
                phase
              }
            };
          }
          if (phase !== style.phase || isSceneReady !== style.phase) {
            if (
              isCurPhaseEnd(prevStyles, phase, isSceneReady, nextPhaseCheckers)
            ) {
              nextPhase(phase);
              return {
                key: "nextPhase",
                style: {
                  phase,
                  isSceneReady
                }
              };
            }
          }
          return styleObj;
        default:
          return styleObj;
      }
    });
  };
}
