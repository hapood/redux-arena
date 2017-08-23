import React from "react";
import { expect } from "chai";
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { spy } from "sinon";
import { Provider } from "react-redux";
import { createMount } from "../testUtils";
import { createArenaStore } from "../../src";
import { MemoryRouter, Link } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import SceneSwitch from "../../src/SceneSwitch";
import PublicScene from "../../src/PublicScene";
import reduxBundleForTest from "../reduxBundleForeTest";
import reducer from "../frameForTest/redux/reducer";
import saga from "../frameForTest/redux/saga";
import DevTools from "../frameForTest/DevTools";
import PrivateScene from "../../src/PrivateScene";
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

describe("<SceneSwitch /> and <PrivateScene/> integration", () => {
  let store, mountWithRedux;

  before(() => {
    store = createArenaStore(
      { frame: reducer },
      { frame: { history: createHistory() } },
      saga,
      [applyMiddleware(thunk), DevTools.instrument()]
    );
    mountWithRedux = createMountWithRedux(store);
  });

  after(() => {
    mountWithRedux.cleanUp();
    store.close();
  });

  describe("special a key for SceneSwitch", () => {
    let wrapper;
    before(() => {
      wrapper = mountWithRedux(
        <MemoryRouter initialEntries={["/pageA", "pageB"]} initialIndex={1}>
          <SceneSwitch reducerKey="newTestKey">
            <PublicScene path="/pageA" asyncSceneBundle={reduxBundleForTest} />
            <PrivateScene
              path="pageB"
              onValidate={vali => vali(true)}
              onPass={() => {}}
              onReject={() => {}}
              asyncSceneBundle={reduxBundleForTest}
            />
          </SceneSwitch>
        </MemoryRouter>
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
