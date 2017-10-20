import AnimationPhase from "./AnimationPhase"
import { TransitionPlainStyle, TransitionStyle, Style } from "react-motion"
import {
    CombinedStyleCalculator,
    StyleCalculators,
    StyleCalculator,
    NextPhaseCheckers,
    ExtendedPlainMotionStyles,
    ExtendedMotionStyles
} from "./types"

export function isCurPhaseEnd(
    prevStyles: ExtendedPlainMotionStyles,
    isSceneReady: boolean,
    nextPhaseCheckers: NextPhaseCheckers
) {
    return prevStyles.find(styleObj => {
        let { key, style } = styleObj
        switch (key) {
            case "container":
                return nextPhaseCheckers.container
                    ? nextPhaseCheckers.container(style, isSceneReady)
                    : false
            case "loadingPlay":
                return nextPhaseCheckers.loadingPlay
                    ? nextPhaseCheckers.loadingPlay(style, isSceneReady)
                    : false
            case "scenePlay":
                return nextPhaseCheckers.scenePlay
                    ? nextPhaseCheckers.scenePlay(style, isSceneReady)
                    : false
            default:
                return false
        }
    }) == null
        ? false
        : true
}

function calcStyle(style: Style, phase: AnimationPhase, calculator: StyleCalculator): Style {
    return Object.assign({}, calculator ? calculator(style, phase) : style, {
        phase
    })
}

export function combineStyleCalculator(
    styleCalculators: StyleCalculators,
    phase: AnimationPhase,
    nextPhaseCheckers: NextPhaseCheckers,
    isSceneReady: boolean,
    nextPhase: (curPhase: AnimationPhase) => void
): CombinedStyleCalculator {
    return function(prevStyles: ExtendedPlainMotionStyles) {
        return <ExtendedMotionStyles>prevStyles.map(styleObj => {
            let { key, style } = styleObj
            switch (key) {
                case "container":
                    return {
                        key: "container",
                        style: calcStyle(style, phase, styleCalculators.container)
                    }
                case "loadingPlay":
                    return {
                        key: "loadingPlay",
                        style: calcStyle(style, phase, styleCalculators.loadingPlay)
                    }
                case "scenePlay":
                    return {
                        key: "scenePlay",
                        style: calcStyle(style, phase, styleCalculators.scenePlay)
                    }
                case "nextPhase":
                    if (isCurPhaseEnd(prevStyles, isSceneReady, nextPhaseCheckers)) {
                        nextPhase(style.phase as number)
                    }
                    return {
                        key: "nextPhase",
                        style: {
                            phase
                        }
                    }
                default:
                    return styleObj
            }
        })
    }
}
