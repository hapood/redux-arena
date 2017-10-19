import {
  SpringHelperConfig,
  TransitionPlainStyle,
  TransitionStyle,
  Style,
  PlainStyle
} from "react-motion";
import { SceneBundle } from "../../core";
import AnimationPhase from "./AnimationPhase";

export type AsyncBundleThunk = () => Promise<SceneBundle>;

export type StyleCalculator = (
  style: Style,
  phase: AnimationPhase
) => TransitionStyle;

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
export type InitMotionStyles = InitMotionStyle[];

export type NumberToStyle = (
  style: PlainStyle,
  phase: AnimationPhase,
  isSceneReady: boolean
) => { [key: string]: string };

export type NumberToStyles = {
  container: NumberToStyle;
  loadingPlay: NumberToStyle;
  scenePlay: NumberToStyle;
};

export type ArenaSceneLoadMotionProps = {
  loadingPlay: React.ReactElement<{}>;
  asyncBundleThunk: AsyncBundleThunk;
  children: (bundle: SceneBundle) => React.ReactElement<{}>;
  initStyles: InitMotionStyles;
  styleCalculators: StyleCalculators;
  nextPhaseCheckers: NextPhaseCheckers;
  numberToStyles: NumberToStyles;
};

export type ArenaSceneLoadMotionConnectedProps = {
  actions: {
    setState: (state: State) => void;
    nextPhase: (phase: AnimationPhase) => void;
    startLeaving: () => void;
    loadSceneBundle: (asyncBundleThunk: AsyncBundleThunk) => void;
  };
} & State;

export type State = {
  isSceneReady: boolean;
  phase: AnimationPhase;
  bundle: SceneBundle | null;
};

export type ExtendedStyleKeys = StyleKeys | "nextPhase";

export interface ExtendedMotionStyle extends TransitionPlainStyle {
  key: StyleKeys | "nextPhase";
}

export interface ExtendedPlainMotionStyle extends TransitionStyle {
  key: StyleKeys | "nextPhase";
}

export type ExtendedMotionStyles = ExtendedMotionStyle[];

export type ExtendedPlainMotionStyles = ExtendedPlainMotionStyle[];

export type CombinedStyleCalculator = (
  prevStyles: ExtendedPlainMotionStyles
) => ExtendedMotionStyles;