import { spring, presets } from "react-motion"
import { loadMotionPhase } from "src"

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
]

export const styleCalculators = {
    container: (style, phase) => style,
    loadingPlay: (style, phase) => style,
    scenePlay: (style, phase) => {
        if (phase === loadMotionPhase.LOADING) {
            return {
                opacity: 0
            }
        } else {
            return {
                opacity: 1
            }
        }
    }
}

export const nextPhaseCheckers = {
    container: () => false,
    loadingPlay: (style, isSceneReady) => {
        if (style.phase === loadMotionPhase.LOADING && isSceneReady === true) return true
        return false
    },
    scenePlay: style => {
        if (style.phase === loadMotionPhase.ENTERING && style.opacity === 1) return true
        if (style.phase !== loadMotionPhase.LOADING && style.phase !== loadMotionPhase.ENTERING) {
            return true
        }
        return false
    }
}

export const numberToStyles = {
    container: (style, phase, isSceneReady) => {},
    loadingPlay: (style, phase, isSceneReady) => {},
    container: (style, phase, isSceneReady) => {}
}
