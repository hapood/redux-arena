import arenaReducer from "./arenaReducer";
import sceneReducer from "./sceneReducer";
import getArenaInitState from "./getArenaInitState";
import getSceneInitState from "./getSceneInitState";

const rootReducer = {
  arena: arenaReducer,
  scene: sceneReducer
};
export { arenaReducer, sceneReducer, getArenaInitState, getSceneInitState };
