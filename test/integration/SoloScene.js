// import React from "react";
// import { expect } from "chai";
// import { spy } from "sinon";
// import { Provider } from "react-redux";
// import { createMount } from "../testUtils";
// import { createArenaStore, SoloScene } from "../../src";
// import sceneBundleForTestA from "../sceneBundleForTestA";

// function createMountWithRedux(store) {
//   let mount = createMount(store);
//   let mountWithRedux = children =>
//     mount(<Provider store={store}>{children}</Provider>);
//   mountWithRedux.cleanUp = mount.cleanUp;
//   return mountWithRedux;
// }

// function selectNeededStates(allStates) {
//   let { arena, ...otherState } = allStates;
//   let metaState, bundleState;
//   Object.keys(otherState).forEach(key => {
//     if (otherState[key].name === "PageA") {
//       bundleState = otherState[key];
//     } else if (otherState[key].curSceneBundle != null) {
//       metaState = otherState[key];
//     }
//   });
//   return {
//     arena,
//     metaState,
//     bundleState
//   };
// }

// describe("<SoloScene /> integration", () => {
//   let store, mountWithRedux;

//   before(() => {
//     store = createArenaStore();
//     mountWithRedux = createMountWithRedux(store);
//   });

//   after(() => {
//     mountWithRedux.cleanUp();
//     store.close();
//   });

//   describe("random reducer key instance", () => {
//     let wrapper;

//     before(() => {
//       wrapper = mountWithRedux(
//         <SoloScene sceneBundle={sceneBundleForTestA} />
//       );
//     });

//     it("should generate right redux state", () => {
//       let flagPromise = new Promise(resolve => {
//         let unsubscribe = store.subscribe(() => {
//           let { arena, metaState, bundleState } = selectNeededStates(
//             store.getState()
//           );
//           if (arena && metaState && bundleState) {
//             if (bundleState.cnt !== 4 || bundleState.sagaCnt !== 1) return;
//             unsubscribe();
//             expect(bundleState.pageA).to.be.true;
//             resolve(true);
//           }
//         });
//       });
//       return flagPromise;
//     });
//   });
// });
