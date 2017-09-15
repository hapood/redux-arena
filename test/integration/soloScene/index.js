import React from "react";
import { expect } from "chai";
import { spy } from "sinon";
import { createMount } from "../../testUtils";
import { createArenaStore } from "../../../src";
import sceneBundleForTestA from "../../sceneBundleForTestA";
import sceneBundleForTestB from "../../sceneBundleForTestB";
import TestHoc from "./TestHOC";

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

describe("<SoloScene /> integration", () => {
  let store, mountWithRedux, wrapper;

  before(() => {
    store = createArenaStore();
    mountWithRedux = createMountWithRedux(store);
    wrapper = mountWithRedux({ sceneBundle: sceneBundleForTestA, store });
  });

  after(() => {
    mountWithRedux.cleanUp();
    store.close();
  });

  it("should generate right redux state", () => {
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

  it("should hot replace state correctly", () => {
    let newProps = {
      sceneBundle: Object.assign({}, sceneBundleForTestA, {
        state: Object.assign({}, sceneBundleForTestA.state, {
          pageA: false
        })
      })
    };
    wrapper.setProps(newProps);
    let flagPromise = new Promise(resolve => {
      let unsubscribe = store.subscribe(() => {
        let { arena, metaState, bundleState } = selectNeededStates(
          store.getState(),
          "PageA"
        );
        if (arena && metaState && bundleState) {
          if (
            bundleState.cnt !== 4 ||
            bundleState.sagaCnt !== 1 ||
            bundleState.pageA !== false
          )
            return;
          unsubscribe();
          resolve(true);
        }
      });
    });
    return flagPromise;
  });

  it("should hot replace bundle correctly", () => {
    let newProps = {
      sceneBundle: Object.assign({}, sceneBundleForTestB, {
        options: {
          reducerKey: "testReducerKey",
          vReducerKey: "testVReducerKey"
        }
      })
    };
    wrapper.setProps(newProps);
    let flagPromise = new Promise(resolve => {
      let unsubscribe = store.subscribe(() => {
        let state = store.getState();
        let { arena, metaState, bundleState } = selectNeededStates(
          state,
          "PageB"
        );
        if (state.testReducerKey == null) return;
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

  it("should hot replace reducer correctly", () => {
    let newProps = {
      sceneBundle: Object.assign({}, sceneBundleForTestB, {
        reducer: (state = sceneBundleForTestA.state, action) => {
          switch (action.type) {
            case "ADD_CNT":
              return Object.assign({}, state, { cnt: state.cnt + 2 });
            default:
              return state;
          }
        },
        options: {
          isSceneReducer: false
        }
      })
    };
    wrapper.setProps(newProps);
    store.dispatch({ type: "ADD_CNT" });
    let flagPromise = new Promise(resolve => {
      let unsubscribe = store.subscribe(() => {
        let { arena, metaState, bundleState } = selectNeededStates(
          store.getState(),
          "PageB"
        );
        console.log(bundleState.cnt);
        if (bundleState.cnt !== 2) return;
        unsubscribe();
        resolve(true);
      });
    });
    return flagPromise;
  });
});
