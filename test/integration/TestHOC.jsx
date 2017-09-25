import React, { Component } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { ArenaScene } from "../../src";

export default class TestHOC extends Component {
  static propTypes = {
    store: PropTypes.any.isRequired,
    sceneBundle: PropTypes.object,
    asyncSceneBundle: PropTypes.any,
    reducerKey: PropTypes.string,
    vReducerKey: PropTypes.string
  };

  render() {
    let props = this.props;
    return (
      <Provider store={props.store}>
        <ArenaScene
          sceneBundle={props.sceneBundle}
          asyncSceneBundle={props.asyncSceneBundle}
          reducerKey={props.reducerKey}
          vReducerKey={props.vReducerKey}
        />
      </Provider>
    );
  }
}
