import { Map, List } from "immutable";

export type StateTreeNode = {
  reducerKey: string;
  pReducerKey: string | null;
  children: Map<string, any>;
};

export type StateTreeDictItem = {
  reducerKey: {
    path: List<string>;
    isObsolete: boolean;
  };
};

export type StateTreeDict = Map<string, Map<string, any>>;

export type StateTree = Map<string, Map<string, any>>;

export type ArenaState = {
  audienceSagaTask: object | null;
  propsLock: boolean;
  stateTree: StateTree;
  stateTreeDict: StateTreeDict;
};
