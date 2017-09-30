import { spring, presets } from "react-motion";
import { sceneMotionPhase } from "src";

export const initStyles = [
  {
    key: "container",
    style: {}
  },
  {
    key: "loadingPlay",
    style: {}
  },
  {
    key: "scenePlay",
    style: {
      opacity: 0
    }
  }
];

export const styleCalculators = {
  container: (style, phase) => style,
  loadingPlay: (style, phase) => style,
  scenePlay: (style, phase) => {
    if (phase === sceneMotionPhase.LOADING) {
      return {
        opacity: 0
      };
    } else {
      return {
        opacity: 1
      };
    }
  }
};

export const nextPhaseCheckers = {
  container: () => false,
  loadingPlay: (style, isSceneReady) => {
    if (style.phase === sceneMotionPhase.LOADING && isSceneReady === true)
      return true;
    return false;
  },
  scenePlay: style => {
    if (style.phase === sceneMotionPhase.ENTERING && style.opacity === 1)
      return true;
    if (
      style.phase !== sceneMotionPhase.LOADING &&
      style.phase !== sceneMotionPhase.ENTERING
    ) {
      return true;
    }
    return false;
  }
};

export const numberToStyle = (key, style, phase, isSceneReady) => {
  switch (key) {
    case "container":
      return {
        width: "100%",
        height: "100%"
      };
    case "loadingPlay":
      return {
        width: "100%",
        height: "100%",
        display: phase === sceneMotionPhase.LOADING ? "block" : "none"
      };
    case "scenePlay":
      return Object.assign(
        {
          width: "100%",
          height: "100%",
          display: phase === sceneMotionPhase.LOADING ? "none" : "block"
        },
        style,
        { opacity: String(style.opacity) }
      );
    default:
      return style;
  }
};
