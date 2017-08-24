import React from "react";
import { expect } from "chai";
import { spy } from "sinon";
import { Provider } from "react-redux";
import { createMount } from "../testUtils";
import { createArenaStore } from "../../src";
import SoloScene from "../../src/SoloScene";
import reduxBundleForTest from "../reduxBundleForeTest";

function createMountWithRedux(store) {
  let mount = createMount(store);
  let mountWithRedux = children =>
    mount(
      <Provider store={store}>
        {children}
      </Provider>
    );
  mountWithRedux.cleanUp = mount.cleanUp;
  return mountWithRedux;
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
      wrapper = mountWithRedux(
        <SoloScene asyncSceneBundle={reduxBundleForTest} />
      );
    });

    it("should generate right redux state", () => {
      let flagPromise = new Promise(resolve => {
        store.subscribe(() => {
          let { arena, metaState, bundleState } = selectNeededStates(
            store.getState()
          );
          if (arena && metaState && bundleState) {
            expect(bundleState.cnt).to.be.equal(0);
            expect(bundleState.pageA).to.be.true;
            resolve(true);
          }
        });
      });
      return flagPromise;
    });
  });
});
