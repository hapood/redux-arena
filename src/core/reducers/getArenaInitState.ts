import { Map } from "immutable";

export type ArenaState = {
  audienceSagaTask: object | null;
  propsLock: boolean;
  stateTree: Map<string, object>;
  stateTreeDict: Map<string, object>;
};

export default function getInitState(): ArenaState {
  return {
    audienceSagaTask: null,
    propsLock: false,
    stateTree: Map(),
    stateTreeDict: Map()
  };
}
