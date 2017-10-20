import { expect } from "chai";
import { spy } from "sinon";
import { applyMiddleware } from "redux";
import createArenaStore from "./createArenaStore";

describe("Redux-Arena start up", () => {
  it("should initial with config correctly", () => {
    let store = createArenaStore(
      { frame: state => state || {} },
      {
        initialStates: { frame: {} },
        middlewares: [
          ({ dispatch, getState }) => next => action => {
            return next(action);
          }
        ]
      }
    );
    let state = store.getState();
    expect(state.arena).to.not.be.null;
    expect(state.frame).to.not.be.null;
    expect(state.frame.audienceSagaTask).to.not.be.null;
  });
});
