import { AnyAction } from "redux";
import { ReactWrapper } from "enzyme";
import { expect } from "chai";
import { spy } from "sinon";
import { createArenaStore, EnhancedStore, SceneBundle } from "src";
import sceneBundleForTestA from "../../sceneBundleForTestA";
import sceneBundleForTestB from "../../sceneBundleForTestB";
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
    store = createArenaStore();
    [mountSceneBundle, cleanUp] = createBundleMounter();
    wrapper = mountSceneBundle(store, sceneBundleForTestA);
  });

  after(() => {
    cleanUp();
    store.close();
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
    let flagPromise = new Promise(resolve => {
      let unsubscribe = store.subscribe(() => {
        let state: any = store.getState();
        let { arena, metaState, bundleState } = selectNeededStates(
          state,
          "PageB"
        );
        if (state.testReducerKey == null) return;
        if (arena && metaState && bundleState) {
          expect(bundleState.cnt).to.be.equal(0);
          expect(bundleState.sagaCnt).to.be.undefined;
          expect(bundleState.pageB).to.be.true;
          unsubscribe();
          resolve(true);
        }
      });
    });
    wrapper.setProps(newProps);
    return flagPromise;
  });

  it("should hot replace reducer correctly", () => {
    let newProps = {
      sceneBundle: Object.assign({}, sceneBundleForTestB, {
        reducer: (
          state: any = sceneBundleForTestA.state,
          action: AnyAction
        ) => {
          switch (action.type) {
            case "ADD_CNT":
              return Object.assign({}, state, { cnt: state.cnt + 16 });
            default:
              return state;
          }
        },
        options: {
          reducerKey: "testReducerKey2",
          vReducerKey: "testVReducerKey2",
          isSceneReducer: false,
          isSceneActions: false
        }
      })
    };
    let flagPromise = new Promise(resolve => {
      let unsubscribe = store.subscribe(() => {
        let { arena, metaState, bundleState } = selectNeededStates(
          store.getState(),
          "PageB"
        );
        if (bundleState) {
          if (bundleState.cnt !== 16) return;
          unsubscribe();
          resolve(true);
        }
      });
    });
    wrapper.setProps(newProps);
    setTimeout(() => store.dispatch({ type: "ADD_CNT" }), 100);
    return flagPromise;
  });
});
