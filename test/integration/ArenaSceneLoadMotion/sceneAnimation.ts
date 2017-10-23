import { spring, presets, PlainStyle, TransitionStyle } from "react-motion";
import {
  LoadMotionPhase,
  StyleCalculators,
  NextPhaseCheckers,
  NumberToStyles,
  InitMotionStyle
} from "src";

export const initStyles: InitMotionStyle[] = [
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

export const styleCalculators: StyleCalculators = {
  container: (style: PlainStyle, phase: LoadMotionPhase) => style,
  loadingPlay: (style: PlainStyle, phase: LoadMotionPhase) => style,
  scenePlay: (style: PlainStyle, phase: LoadMotionPhase) => {
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

export const nextPhaseCheckers: NextPhaseCheckers = {
  container: () => false,
  loadingPlay: (style: PlainStyle, isSceneReady: boolean) => {
    if (style.phase === LoadMotionPhase.LOADING && isSceneReady === true)
      return true;
    return false;
  },
  scenePlay: (style: PlainStyle) => {
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

export const numberToStyles: NumberToStyles = {
  container: (
    style: PlainStyle,
    phase: LoadMotionPhase,
    isSceneReady: boolean
  ) => ({}),
  loadingPlay: (
    style: PlainStyle,
    phase: LoadMotionPhase,
    isSceneReady: boolean
  ) => ({}),
  scenePlay: (
    style: PlainStyle,
    phase: LoadMotionPhase,
    isSceneReady: boolean
  ) => ({})
};
