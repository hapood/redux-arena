import { ENTERING, IN, LEAVING, OUT } from "../../animationPhase";
export function isCurPhaseEnd(
  phase,
  prevStyles,
  isSceneReady,
  nextPhaseCheckers
) {
  return prevStyles.find(styleObj => {
    let { key, style } = styleObj;
    switch (key) {
      case "container":
        return nextPhaseCheckers.container
          ? nextPhaseCheckers.container(phase, style)
          : false;
      case "loadingPlay":
        return nextPhaseCheckers.loadingPlay
          ? nextPhaseCheckers.loadingPlay(phase, style)
          : false;
      case "scenePlay":
        return nextPhaseCheckers.scenePlay
          ? nextPhaseCheckers.scenePlay(phase, style)
          : false;
      default:
        return false;
    }
  }) == null
    ? false
    : true;
}

export function buildStyleCalculator(
  phase,
  styleCalculators,
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
              ? styleCalculators.container(style, phase)
              : style
          };
        case "loadingPlay":
          return {
            key: "loadingPlay",
            style: styleCalculators.loadingPlay
              ? styleCalculators.loadingPlay(style, phase)
              : style
          };
        case "scenePlay":
          return {
            key: "scenePlay",
            style: styleCalculators.scenePlay
              ? styleCalculators.scenePlay(style, phase)
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
          if (phase !== style.phase) {
            if (
              isCurPhaseEnd(phase, prevStyles, isSceneReady, nextPhaseCheckers)
            ) {
              nextPhase(phase);
              return {
                key: "nextPhase",
                style: {
                  phase
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
