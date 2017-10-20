import initState from "./state"
import ActionTypes from "./ActionTypes"
import AnimationPhase from "./AnimationPhase"
import { State } from "./types"
import { AnyAction } from "redux"

export default function(state: State = initState, action: AnyAction, sceneReducerKey: string) {
    if (action._sceneReducerKey !== sceneReducerKey) return state
    switch (action.type) {
        case ActionTypes.ARENA_SCENE_ANIMATION_NEXTPHRASE:
            if (state.phase !== action.phase) return state
            switch (state.phase) {
                case AnimationPhase.LOADING:
                    return Object.assign({}, state, {
                        phase: AnimationPhase.ENTERING
                    })
                case AnimationPhase.ENTERING:
                    return Object.assign({}, state, {
                        phase: AnimationPhase.IN
                    })
                case AnimationPhase.LEAVING:
                    return Object.assign({}, state, { phase: AnimationPhase.OUT })
                default:
                    return state
            }
        case ActionTypes.ARENA_SCENE_ANIMATION_LEAVING_START:
            if (state.phase === AnimationPhase.IN)
                return Object.assign({}, state, { phase: AnimationPhase.LEAVING })
        default:
            return state
    }
}
