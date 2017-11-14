export type State = {
  name: string;
  dynamicState: number;
  isDynamicStateEnable: boolean;
  cnt: number;
};

export type Actions = {
  addCnt: () => void;
  clearCnt: () => void;
  switchDynamicState: (isEnabled: boolean) => void;
};
