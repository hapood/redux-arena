import {
  ARENA_LOAD_SCENE,
  ARENA_LOAD_ASYNCSCENE,
  SCENE_LOAD_START,
  SCENE_LOAD_END,
  SCENE_PLAY_START,
  SCENE_PLAY_END
} from "../../redux/actionTypes";

export function ArenaLoadScene(
  sceneBundle,
  match,
  location,
  OldPlayingScene,
  sceneNo
) {
  return {
    type: ARENA_LOAD_SCENE,
    SceneComponent: sceneBundle.Component,
    state: sceneBundle.state,
    saga: sceneBundle.saga,
    reducer: sceneBundle.reducer,
    match,
    location,
    OldPlayingScene,
    sceneNo
  };
}

export function arenaLoadAsyncScene(
  asyncSceneBundle,
  match,
  location,
  OldPlayingScene,
  sceneNo
) {
  return {
    type: ARENA_LOAD_ASYNCSCENE,
    asyncSceneBundle,
    match,
    location,
    OldPlayingScene,
    sceneNo
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
