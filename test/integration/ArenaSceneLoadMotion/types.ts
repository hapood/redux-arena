import { ReactWrapper } from "enzyme";
import { EnhancedStore, SceneBundle, SceneBundleThunk } from "src";

export type MountBundleThunk = (
  store: EnhancedStore,
  sceneBundleThunk: SceneBundleThunk
) => ReactWrapper;
