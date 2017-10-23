import { ActionCreator } from "redux";

export type State = {
  name: string;
  pageA: boolean;
  sagaCnt: number;
  cnt: number;
};

export type Props = {
  actions: {
    addCnt: ActionCreator<{}>;
    addCntBySaga: ActionCreator<{}>;
    addSagaCnt: ActionCreator<{}>;
  };
} & State;
