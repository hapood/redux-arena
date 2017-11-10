import * as React from "react";
import { createMount } from "../../testUtils";
import { EnhancedStore, SceneBundle } from "src";
import { MountBundle } from "./types";
import TestHOC from "./TestHOC";

export default function createBundleMounter(): [MountBundle, () => void] {
  let [mount, cleanUp] = createMount();
  let mountWithProps = (
    store: EnhancedStore,
    sceneBundle: SceneBundle<{}, {}, {}>
  ) => mount(<TestHOC store={store} sceneBundle={sceneBundle} />);
  return [mountWithProps, cleanUp];
}
