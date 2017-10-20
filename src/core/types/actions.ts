import ActionTypes from "../ActionTypes"
import { ReducerDict } from "./reducerDict"
import { SceneBundle } from "./bundle"

export type CurtainLoadSceneAction = {
    type: ActionTypes.ARENA_CURTAIN_LOAD_SCENE
    arenaReducerDict: ReducerDict
    sceneBundle: SceneBundle
    isInitial: boolean
    loadedCb: () => void
}
