export default function getArenaSwitchInitState() {
  return {
    PlayingScene: null,
    curSceneBundle: {},
    reduxInfo: {},
    actions:{},
    isWaiting: true,
    sceneNo: 0,
    match: undefined,
    location: undefined,
    history: undefined
  };
}
