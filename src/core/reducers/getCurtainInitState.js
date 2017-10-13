export default function getSwitchInitState() {
  return {
    PlayingScene: null,
    curSceneBundle: {},
    reduxInfo: {},
    mutableObj: { isObsolete: false }
  };
}
