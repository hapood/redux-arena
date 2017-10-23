import * as React from "react";
import { ReactWrapper } from "enzyme";
import { expect } from "chai";
import { spy } from "sinon";
import {
  createArenaStore,
  LoadMotionPhase,
  EnhancedStore,
  SceneBundleThunk
} from "src";
import { MountBundleThunk } from "./types";
import TestHOC from "./TestHOC";
import createBundleThunkMounter from "./createBundleThunkMounter";

function selectAnimationState(allStates: any): any {
  let animationState;
  Object.keys(allStates).forEach(key => {
    if (allStates[key].phase != null) {
      animationState = allStates[key];
    }
  });
  return animationState;
}

describe("<ArenaSceneLoadMotion /> integration", () => {
  let store: EnhancedStore,
    mount: MountBundleThunk,
    cleanUp: () => void,
    wrapper;

  before(() => {
    [mount, cleanUp] = createBundleThunkMounter();
    store = createArenaStore();
  });

  after(() => {
    cleanUp();
    store.close();
  });

  it("should step into IN phase correctly", () => {
    wrapper = mount(store, (() => import("../../sceneBundleForTestA")) as any);
    let flagPromise = new Promise(resolve => {
      let unsubscribe = store.subscribe(() => {
        let animationState = selectAnimationState(store.getState());
        if (animationState && animationState.phase === LoadMotionPhase.IN) {
          unsubscribe();
          resolve(true);
        }
      });
    });
    return flagPromise;
  });
});
