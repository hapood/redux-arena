import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import invariant from "invariant";
import SceneLoading from "../SceneLoading";
import { arenaSwitchConnect } from "../SceneBundle";

class RouteScene extends Component {
  static contextTypes = {
    arenaSwitchReducerKey: PropTypes.string
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
    console.log(this.props);
    let { arenaSwitchReducerKey } = this.context;
    invariant(
      arenaSwitchReducerKey,
      "You should not use <RouteScene> outside a <ArenaSwitch>"
    );
    let { asyncSceneBundle, sceneBundle, SceneLoadingComponent } = this.props;
    let wrappedSceneBundle = arenaSwitchConnect(arenaSwitchReducerKey);
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent
    });
    this.state = {
      wrappedSceneBundle,
      sceneBundleElement
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let refreshFlag = false;
    let { asyncSceneBundle, sceneBundle, SceneLoadingComponent } = nextProps;
    if (
      this.context.arenaSwitchReducerKey !== nextContext.arenaSwitchReducerKey
    ) {
      this.state.wrappedSceneBundle = arenaSwitchConnect(
        nextContext.arenaSwitchReducerKey
      );
      refreshFlag = true;
    }
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      SceneLoadingComponent !== this.props.SceneLoadingComponent ||
      refreshFlag
    ) {
      this.state.sceneBundleElement = React.createElement(
        this.state.wrappedSceneBundle,
        {
          asyncSceneBundle,
          sceneBundle,
          SceneLoadingComponent
        }
      );
    }
  }

  render() {
    let { exact, strict, path, computedMatch, location } = this.props;
    return (
      <Route
        location={location}
        computedMatch={computedMatch}
        exact={exact}
        path={path}
        strict={strict}
        render={props => {
          return React.cloneElement(this.state.sceneBundleElement, props);
        }}
      />
    );
  }
}

export default RouteScene;
