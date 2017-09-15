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

function selectNeededStates(allStates) {
  let { arena, ...otherState } = allStates;
  let metaState, bundleState;
  Object.keys(otherState).forEach(key => {
    if (otherState[key].name === "PageA") {
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
  let store, mountWithRedux;

  before(() => {
    store = createArenaStore();
    mountWithRedux = createMountWithRedux(store);
  });

  after(() => {
    mountWithRedux.cleanUp();
    store.close();
  });

  describe("random reducer key instance", () => {
    let wrapper;

    before(() => {
      store = createArenaStore();
      wrapper = mountWithRedux({ sceneBundle: sceneBundleForTestA, store });
    });

    it("should generate right redux state", () => {
      let flagPromise = new Promise(resolve => {
        let unsubscribe = store.subscribe(() => {
          let { arena, metaState, bundleState } = selectNeededStates(
            store.getState()
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
          state: { pageA: false, name: "pageA" }
        })
      };
      wrapper.setProps(newProps);
      let flagPromise = new Promise(resolve => {
        let unsubscribe = store.subscribe(() => {
          let { arena, metaState, bundleState } = selectNeededStates(
            store.getState()
          );
          if (arena && metaState && bundleState) {
            console.log(bundleState)
            if (bundleState.cnt != null) return;
            unsubscribe();
            expect(bundleState.pageA).to.be.false;
            resolve(true);
          }
        });
      });
      return flagPromise;
    });
  });
});
