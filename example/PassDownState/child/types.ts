import { State as ParentState, Actions as ParentActions } from "../types";

export type State = {
  name: string;
  cnt: number;
};

export type ConnectedProps = {
  parentState: ParentState;
  parentActions: ParentActions;
};

export type Actions = {
  addCnt: () => void;
  clearCnt: () => void;
};

export type Props = State & ConnectedProps & { actions: Actions };
