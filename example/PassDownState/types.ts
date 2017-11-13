export type State = {
  name: string;
  cnt: number;
};

export type Actions = {
  addCnt: () => void;
  clearCnt: () => void;
};
