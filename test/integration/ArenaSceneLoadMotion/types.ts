import { ReactWrapper } from "enzyme";
import { EnhancedStore, SceneBundle, SceneBundleThunk } from "src";

export type MountBundleThunk = (
  store: EnhancedStore,
  bundleThunk: SceneBundleThunk
) => ReactWrapper;
