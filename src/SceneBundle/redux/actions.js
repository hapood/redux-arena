import {
  ARENA_SCENE_SWITCH,
  SCENE_LOAD_START,
  SCENE_LOAD_END,
  SCENE_PLAY_START,
  SCENE_PLAY_END
} from "../../redux/actionTypes";

export function ArenaLoadScene(
  SceneComponent,
  state,
  reducer,
  saga,
  match,
  location,
  sceneNo
) {
  return {
    type: ARENA_SCENE_SWITCH,
    state,
    saga,
    reducer,
    match,
    location,
    SceneComponent,
    newSceneNo: sceneNo
  };
}

export function sceneLoadStart() {
  return { type: SCENE_LOAD_START };
}

export function sceneLoadEnd() {
  return { type: SCENE_LOAD_END };
}

export function sceneStartPlay() {
  return { type: SCENE_PLAY_START };
}

export function sceneStopPlay() {
  return { type: SCENE_PLAY_END };
}
