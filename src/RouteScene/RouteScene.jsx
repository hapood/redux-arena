import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import invariant from "invariant";
import { ARENASWITCH_SET_STATE } from "../redux/actionTypes";
import SceneLoading from "../SceneLoading";
import { arenaSwitchConnect } from "../SceneBundle";

class RouteScene extends Component {
  static contextTypes = {
    arenaSwitchReducerKey: PropTypes.string,
    store: PropTypes.any
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
    let { store, arenaSwitchReducerKey } = this.context;
    return (
      <Route
        location={location}
        computedMatch={computedMatch}
        exact={exact}
        path={path}
        strict={strict}
        render={props => {
          store.dispatch({
            type: ARENASWITCH_SET_STATE,
            arenaSwitchReducerKey,
            state: props
          });
          return React.cloneElement(this.state.sceneBundleElement, props);
        }}
      />
    );
  }
}

export default RouteScene;
