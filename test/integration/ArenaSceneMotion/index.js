import React from "react";
import { expect } from "chai";
import { spy } from "sinon";
import { createMount } from "../../testUtils";
import { createArenaStore, sceneMotionPhase } from "src";
import { bundleToElement } from "src/tools";
import sceneBundleForTestA from "../../sceneBundleForTestA";
import TestHOC from "./TestHOC";

function selectAnimationState(allStates, name) {
  let animationState;
  Object.keys(allStates).forEach(key => {
    if (allStates[key].phase != null) {
      animationState = allStates[key];
    }
  });
  return animationState;
}

describe("<ArenaSceneMotion /> integration", () => {
  let store, mount, wrapper;

  before(() => {
    mount = createMount();
    store = createArenaStore();
  });

  after(() => {
    mount.cleanUp();
    store.close();
  });

  it("should step into IN phase correctly", () => {
    wrapper = mount(
      <TestHOC store={store}>
        {bundleToElement(
          Object.assign({}, sceneBundleForTestA, {
            options: { reducerKey: "bundle" }
          })
        )}
      </TestHOC>
    );
    let flagPromise = new Promise(resolve => {
      let unsubscribe = store.subscribe(() => {
        let animationState = selectAnimationState(store.getState());
        if (animationState && animationState.phase === sceneMotionPhase.IN) {
          unsubscribe();
          resolve(true);
        }
      });
    });
    return flagPromise;
  });
});
