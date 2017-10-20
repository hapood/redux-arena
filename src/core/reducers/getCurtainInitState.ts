import { CurtainState } from "./types";

export default function getCurtainInitState(): CurtainState {
  return {
    PlayingScene: null,
    curSceneBundle: null,
    reduxInfo: null,
    mutableObj: { isObsolete: false }
  };
}
