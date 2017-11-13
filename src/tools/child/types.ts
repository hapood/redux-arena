export type State = {
  name: string;
  cnt: number;
};

export type ConnectedProps = {
  parentState: {};
  parentActions: Actions;
};

export type Actions = {
  addCnt: () => void;
  clearCnt: () => void;
};

export type Props = State & ConnectedProps & { actions: Actions };
