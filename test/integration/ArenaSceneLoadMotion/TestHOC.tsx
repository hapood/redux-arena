import * as React from "react";
import { Provider } from "react-redux";
import { ArenaSceneLoadMotion, EnhancedStore, SceneBundleThunk } from "src";
import { bundleToElement } from "src/tools";
import * as sceneAnimation from "./sceneAnimation";

export type TestHOCProps = {
  store: EnhancedStore;
  sceneBundleThunk: SceneBundleThunk;
  reducerKey?: string;
  vReducerKey?: string;
};

export default class TestHOC extends React.Component<TestHOCProps> {
  render() {
    let props = this.props;
    return (
      <Provider store={props.store}>
        <ArenaSceneLoadMotion
          sceneBundleThunk={props.sceneBundleThunk}
          loadingPlay={<div />}
          initStyles={sceneAnimation.initStyles}
          styleCalculators={sceneAnimation.styleCalculators}
          numberToStyles={sceneAnimation.numberToStyles}
          nextPhaseCheckers={sceneAnimation.nextPhaseCheckers}
        >
          {bundle =>
            bundleToElement(
              Object.assign({}, bundle, {
                options: { reducerKey: "bundle" }
              })
            )}
        </ArenaSceneLoadMotion>
      </Provider>
    );
  }
}
