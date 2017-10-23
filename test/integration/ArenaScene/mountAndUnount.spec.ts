import * as React from "react";
import { ReactWrapper } from "enzyme";
import { expect } from "chai";
import { spy } from "sinon";
import { createArenaStore, EnhancedStore, SceneBundle } from "src";
import sceneBundleForTestA from "../../sceneBundleForTestA";
import { MountBundle } from "./types";
import createBundleMounter from "./createBundleMounter";

function selectNeededStates(allStates: any, name: string): any {
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

describe("<ArenaScene /> integration", () => {
  let store: EnhancedStore,
    mountSceneBundle: MountBundle,
    wrapper: ReactWrapper,
    cleanUp: () => void;

  before(() => {
    [mountSceneBundle, cleanUp] = createBundleMounter();
    store = createArenaStore();
  });

  after(() => {
    store.close();
  });

  it("should mount with right redux state", () => {
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
    wrapper = mountSceneBundle(store, sceneBundleForTestA);
    return flagPromise;
  });

  it("should unmount with right redux state", () => {
    cleanUp();
    let flagPromise = new Promise(resolve => {
      let unsubscribe = store.subscribe(() => {
        let state: any = store.getState();
        Object.keys(state).length == 1;
        if (Object.keys(state).length == 1) {
          unsubscribe();
          expect(state.arena).to.not.be.null;
          resolve(true);
        }
      });
    });
    return flagPromise;
  });
});
