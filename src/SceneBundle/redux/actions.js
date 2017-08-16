import {
  SCENESWITCH_SWITCH_SCENE,
  SCENESWITCH_LOAD_ASYNCSCENE,
  SCENE_LOAD_START,
  SCENE_PLAY_START,
  SCENE_PLAY_END,
  SCENE_LOAD_END
} from "../../redux/actionTypes";

export function ArenaLoadScene(
  sceneSwitchKey,
  sceneBundle,
  match,
  location,
  OldPlayingScene,
  sceneNo
) {
  return {
    type: SCENESWITCH_SWITCH_SCENE,
    sceneSwitchKey,
    sceneBundle,
    match,
    location,
    OldPlayingScene,
    sceneNo
  };
}

export function arenaLoadAsyncScene(
  sceneSwitchKey,
  asyncSceneBundle,
  match,
  location,
  OldPlayingScene,
  sceneNo
) {
  return {
    type: SCENESWITCH_LOAD_ASYNCSCENE,
    sceneSwitchKey,
    asyncSceneBundle,
    match,
    location,
    OldPlayingScene,
    sceneNo
  };
}

export function sceneLoadStart(
  sceneSwitchKey,
  match,
  location,
  sceneBundle,
  asyncSceneBundle
) {
  return {
    type: SCENE_LOAD_START,
    sceneSwitchKey,
    match,
    location,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneStartPlay(
  sceneSwitchKey,
  match,
  location,
  sceneBundle,
  asyncSceneBundle
) {
  return {
    type: SCENE_PLAY_START,
    sceneSwitchKey,
    match,
    location,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneLoadEnd(
  sceneSwitchKey,
  match,
  location,
  sceneBundle,
  asyncSceneBundle
) {
  return {
    type: SCENE_LOAD_END,
    sceneSwitchKey,
    match,
    location,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneStopPlay(
  sceneSwitchKey,
  match,
  location,
  sceneBundle,
  asyncSceneBundle
) {
  return {
    type: SCENE_PLAY_END,
    sceneSwitchKey,
    match,
    location,
    sceneBundle,
    asyncSceneBundle
  };
}
