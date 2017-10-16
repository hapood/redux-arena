import Immutable from "immutable";

export default function getInitState() {
  return {
    audienceSagaTask: null,
    propsLock: false,
    stateTree: Immutable.Map(),
    stateTreeDict: Immutable.Map()
  };
}
