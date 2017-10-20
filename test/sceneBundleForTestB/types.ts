import { ActionCreator } from "redux";

export type State = {
  name: string;
  pageB: boolean;
  cnt: number;
};

export type Props = {
  actions: {
    addCnt: ActionCreator<{}>;
  };
} & State;
