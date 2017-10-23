import {
  SpringHelperConfig,
  TransitionPlainStyle,
  TransitionStyle,
  Style,
  PlainStyle
} from "react-motion";
import { SceneBundle, SceneBundleThunk } from "../../core";
import AnimationPhases from "./AnimationPhases";

export type SceneBundleThunk = () => Promise<SceneBundle>;

export type StyleCalculator = (
  style: PlainStyle,
  phase: AnimationPhases
) => Style;

export type StyleCalculators = {
  container: StyleCalculator;
  loadingPlay: StyleCalculator;
  scenePlay: StyleCalculator;
};

export type NextPhaseChecker = (style: Style, isSceneReady: boolean) => boolean;

export type NextPhaseCheckers = {
  container: NextPhaseChecker;
  loadingPlay: NextPhaseChecker;
  scenePlay: NextPhaseChecker;
};
export type StyleKeys = "container" | "loadingPlay" | "scenePlay";
export interface InitMotionStyle extends TransitionPlainStyle {
  key: StyleKeys;
}

export type NumberToStyle = (
  style: PlainStyle,
  phase: AnimationPhases,
  isSceneReady: boolean
) => { [key: string]: string };

export type NumberToStyles = {
  container: NumberToStyle;
  loadingPlay: NumberToStyle;
  scenePlay: NumberToStyle;
};

export type ArenaSceneLoadMotionProps = {
  loadingPlay: React.ReactElement<{}>;
  sceneBundleThunk: SceneBundleThunk;
  children: (bundle: SceneBundle) => React.ReactElement<{}>;
  initStyles: InitMotionStyle[];
  styleCalculators: StyleCalculators;
  nextPhaseCheckers: NextPhaseCheckers;
  numberToStyles: NumberToStyles;
};

export type ArenaSceneLoadMotionConnectedProps = {
  actions: {
    setState: (state: State) => void;
    nextPhase: (phase: AnimationPhases) => void;
    startLeaving: () => void;
    loadSceneBundle: (sceneBundleThunk: SceneBundleThunk) => void;
  };
} & State;

export type State = {
  isSceneReady: boolean;
  phase: AnimationPhases;
  bundle: SceneBundle | null;
};

export type ExtendedStyleKeys = StyleKeys | "nextPhase";

export interface ExtendedMotionStyle extends TransitionPlainStyle {
  key: StyleKeys | "nextPhase";
}

export interface ExtendedPlainMotionStyle extends TransitionPlainStyle {
  key: StyleKeys | "nextPhase";
}

export type CombinedStyleCalculator = (
  prevStyles: ExtendedPlainMotionStyle[]
) => ExtendedMotionStyle[];
