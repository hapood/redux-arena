import { ReactWrapper } from "enzyme";
import { EnhancedStore, SceneBundle } from "src";

export type MountBundle = (
  store: EnhancedStore,
  sceneBundle: SceneBundle<{}, {}, {}>
) => ReactWrapper;
