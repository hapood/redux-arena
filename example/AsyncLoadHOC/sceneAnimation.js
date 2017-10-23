import { spring, presets } from "react-motion";
import { LoadMotionPhase } from "redux-arena";

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
    if (phase === LoadMotionPhase.LOADING) {
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
    if (style.phase === LoadMotionPhase.LOADING && isSceneReady === true)
      return true;
    return false;
  },
  scenePlay: style => {
    if (style.phase === LoadMotionPhase.ENTERING && style.opacity === 1)
      return true;
    if (
      style.phase !== LoadMotionPhase.LOADING &&
      style.phase !== LoadMotionPhase.ENTERING
    ) {
      return true;
    }
    return false;
  }
};

export const numberToStyles = {
  container: (style, phase, isSceneReady) => ({
    width: "100%",
    height: "100%",
    position: "absolute"
  }),
  loadingPlay: (style, phase, isSceneReady) => ({
    width: "100%",
    height: "100%",
    position: "absolute",
    display: phase === LoadMotionPhase.LOADING ? "block" : "none"
  }),
  scenePlay: (style, phase, isSceneReady) =>
    Object.assign(
      {
        width: "100%",
        height: "100%",
        position: "absolute",
        display: phase === LoadMotionPhase.LOADING ? "none" : "block"
      },
      style,
      { opacity: String(style.opacity) }
    )
};
