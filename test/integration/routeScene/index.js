import React, { Component } from "react";
import { expect } from "chai";
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { spy } from "sinon";
import { createMount } from "../../testUtils";
import { createArenaStore } from "../../../src";
import createHistory from "history/createBrowserHistory";
import sceneBundleForTestA from "../../sceneBundleForTestA";
import { saga, reducer } from "../../frameForTest";
import { GO_TO_URL } from "../../frameForTest/actionTypes";
import TestHoc from "./TestHOC";

let asyncSceneBundleForTestB = import("../../sceneBundleForTestB");

function createMountWithRedux() {
  let mount = createMount();
  let mountWithProps = props => mount(<TestHoc {...props} />);
  mountWithProps.cleanUp = mount.cleanUp;
  return mountWithProps;
}

function selectNeededStates(allStates, name) {
  let { arena, ...otherState } = allStates;
  let metaState, bundleState;
  Object.keys(otherState).forEach(key => {
    if (otherState[key].name === name) {
      bundleState = otherState[key];
    } else if (otherState[key].curSceneBundle != null) {
      metaState = otherState[key];
    }
  });
  return {
    arena,
    metaState,
    bundleState
  };
}

describe("<ArenaSwitch /> <RouteScene/> integration", () => {
  let store,
    mountWithProps,
    wrapper,
    history = createHistory();

  before(() => {
    store = createArenaStore({ frame: reducer }, { frame: { history } }, saga, [
      applyMiddleware(thunk)
    ]);
    mountWithProps = createMountWithRedux();
    wrapper = mountWithProps({
      store,
      history,
      pageABundle: sceneBundleForTestA,
      pageBAscyncBundle: asyncSceneBundleForTestB
    });
  });

  after(() => {
    mountWithProps.cleanUp();
    store.close();
  });

  describe("pageA sceneBundle should be mounted correctly", () => {
    it("should generate right redux state", () => {
      store.dispatch({ type: GO_TO_URL, url: "/pageA" });
      let flagPromise = new Promise(resolve => {
        let unsubscribe = store.subscribe(() => {
          let { arena, metaState, bundleState } = selectNeededStates(
            store.getState(),
            "PageA"
          );
          if (arena && metaState && bundleState) {
            if (bundleState.cnt !== 4 || bundleState.sagaCnt !== 1) return;
            unsubscribe();
            expect(bundleState.pageA).to.be.true;
            resolve(true);
          }
        });
      });
      return flagPromise;
    });
  });

  describe("pageB asyncSceneBundle should be mounted correctly", () => {
    it("should generate right redux state", () => {
      store.dispatch({ type: GO_TO_URL, url: "/pageB" });
      let flagPromise = new Promise(resolve => {
        let unsubscribe = store.subscribe(() => {
          let { arena, metaState, bundleState } = selectNeededStates(
            store.getState(),
            "PageB"
          );
          if (arena && metaState && bundleState) {
            unsubscribe();
            expect(bundleState.cnt).to.be.equal(0);
            expect(bundleState.sagaCnt).to.be.undefined;
            expect(bundleState.pageB).to.be.true;
            resolve(true);
          }
        });
      });
      return flagPromise;
    });
  });

  describe("change PageA bundle with some options", () => {
    it("should generate right redux state", () => {
      let newPageABundle = Object.assign({}, sceneBundleForTestA, {
        options: { reducerKey: "pageA" }
      });
      let newProps = {
        reducerKey: "arenaSwitch",
        pageABundle: newPageABundle,
        pageAAscyncBundle: null,
        pageAReducerKey: "pageACurtain"
      };
      wrapper.setProps(newProps);
      store.dispatch({ type: GO_TO_URL, url: "/pageA" });
      let flagPromise = new Promise(resolve => {
        let unsubscribe = store.subscribe(() => {
          let state = store.getState();
          if (
            state["arenaSwitch"] == null ||
            state["pageA"] == null ||
            state["pageACurtain"] == null
          )
            return;
          let { arena, metaState, bundleState } = selectNeededStates(
            state,
            "PageA"
          );
          if (arena && metaState && bundleState) {
            if (bundleState.cnt !== 4 || bundleState.sagaCnt !== 1) return;
            unsubscribe();
            expect(bundleState.pageA).to.be.true;
            expect(bundleState.pageA).to.be.true;
            resolve(true);
          }
        });
      });
      return flagPromise;
    });
  });
});
