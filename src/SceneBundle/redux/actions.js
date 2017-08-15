import {
  ARENA_SWITCH_SCENE,
  ARENA_LOAD_ASYNCSCENE,
  SCENE_LOAD_START,
  SCENE_PLAY_START,
  SCENE_PLAY_END,
  SCENE_LOAD_END
} from "../../redux/actionTypes";

export function ArenaLoadScene(
  sceneBundle,
  match,
  location,
  OldPlayingScene,
  sceneNo
) {
  return {
    type: ARENA_SWITCH_SCENE,
    sceneBundle,
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

export function sceneLoadStart(match, location, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_LOAD_START,
    match,
    location,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneStartPlay(match, location, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_PLAY_START,
    match,
    location,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneLoadEnd(match, location, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_LOAD_END,
    match,
    location,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneStopPlay(match, location, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_PLAY_END,
    match,
    location,
    sceneBundle,
    asyncSceneBundle
  };
}
