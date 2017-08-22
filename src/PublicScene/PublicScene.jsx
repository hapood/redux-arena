import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import invariant from "invariant";
import SceneLoading from "../SceneLoading";
import { sceneSwitchConnect } from "../SceneBundle";

class PublicScene extends Component {
  static contextTypes = {
    sceneSwitchReducerKey: PropTypes.string
  };

  static propTypes = {
    asyncSceneBuldle: PropTypes.any,
    scene: PropTypes.any,
    SceneLoadingComponent: PropTypes.any,
    exact: PropTypes.bool,
    path: PropTypes.string,
    strict: PropTypes.bool
  };

  static defaultProps = {
    SceneLoadingComponent: SceneLoading,
    exact: true
  };

  componentWillMount() {
    let { sceneSwitchReducerKey } = this.context;
    invariant(
      sceneSwitchReducerKey,
      "You should not use <PublicScene> outside a <SceneSwitch>"
    );
    let {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent,
      location,
      computedMatch
    } = this.props;
    let wrappedSceneBundle = sceneSwitchConnect(sceneSwitchReducerKey);
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent,
      sceneSwitchLocation: location,
      sceneSwitchMatch: computedMatch,
      sceneSwitchReducerKey: this.context.sceneSwitchReducerKey
    });
    this.state = {
      wrappedSceneBundle,
      sceneBundleElement
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent,
      location,
      computedMatch
    } = nextProps;
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      SceneLoadingComponent !== this.props.SceneLoadingComponent ||
      this.context.sceneSwitchReducerKey !== nextContext.sceneSwitchReducerKey
    ) {
      let wrappedSceneBundle = sceneSwitchConnect(nextContext.sceneSwitchReducerKey);
      this.state.sceneBundleElement = React.createElement(
        wrappedSceneBundle,
        {
          asyncSceneBundle,
          sceneBundle,
          SceneLoadingComponent,
          sceneSwitchLocation: location,
          sceneSwitchMatch: computedMatch
        }
      );
    }
  }

  render() {
    let { exact, strict, path } = this.props;
    return (
      <Route
        exact={exact}
        path={path}
        strict={strict}
        render={() => this.state.sceneBundleElement}
      />
    );
  }
}

export default PublicScene;
