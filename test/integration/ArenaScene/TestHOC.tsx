import * as React from "react";
import { Provider } from "react-redux";
import { ArenaScene, EnhancedStore, SceneBundle } from "src";

export type TestHOCProps = {
  store: EnhancedStore;
  sceneBundle: SceneBundle;
  reducerKey?: string;
  vReducerKey?: string;
};

export default class TestHOC extends React.Component<TestHOCProps> {
  render() {
    let props = this.props;
    return (
      <Provider store={props.store}>
        <ArenaScene
          sceneBundle={props.sceneBundle}
          reducerKey={props.reducerKey}
          vReducerKey={props.vReducerKey}
        />
      </Provider>
    );
  }
}
