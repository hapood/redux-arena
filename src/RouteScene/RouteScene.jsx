import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import invariant from "invariant";
import { ARENA_SWITCH_SET_STATE } from "../redux/actionTypes";
import { arenaSwitchConnect } from "../SceneBundle";

class RouteScene extends Component {
  static contextTypes = {
    arenaReducerDict: PropTypes.object,
    store: PropTypes.any
  };

  static propTypes = {
    asyncSceneBuldle: PropTypes.any,
    sceneBundle: PropTypes.any,
    SceneLoadingComponent: PropTypes.any,
    sceneProps: PropTypes.object,
    exact: PropTypes.bool,
    path: PropTypes.string,
    strict: PropTypes.bool
  };

  static defaultProps = {
    exact: true
  };

  componentWillMount() {
    let { arenaReducerDict } = this.context;
    invariant(
      arenaReducerDict,
      "You should not use <RouteScene> outside a <ArenaSwitch>"
    );
    let {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent,
      sceneProps
    } = this.props;
    let wrappedSceneBundle = arenaSwitchConnect(arenaReducerDict);
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent,
      sceneProps
    });
    this.state = {
      wrappedSceneBundle,
      sceneBundleElement
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let refreshFlag = false;
    let {
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      SceneLoadingComponent
    } = nextProps;
    if (this.context.arenaReducerDict !== nextContext.arenaReducerDict) {
      this.state.wrappedSceneBundle = arenaSwitchConnect(
        nextContext.arenaReducerDict
      );
      refreshFlag = true;
    }
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      SceneLoadingComponent !== this.props.SceneLoadingComponent ||
      refreshFlag === true
    ) {
      this.state.sceneBundleElement = React.createElement(
        this.state.wrappedSceneBundle,
        {
          asyncSceneBundle,
          sceneBundle,
          sceneProps,
          SceneLoadingComponent
        }
      );
    }
  }

  render() {
    let { exact, strict, path, computedMatch, location } = this.props;
    let { store, arenaReducerDict } = this.context;
    return (
      <Route
        location={location}
        computedMatch={computedMatch}
        exact={exact}
        path={path}
        strict={strict}
        render={props => {
          store.dispatch({
            type: ARENA_SWITCH_SET_STATE,
            arenaSwitchReducerKey: arenaReducerDict._curSwitch.reducerKey,
            state: props
          });
          return React.cloneElement(this.state.sceneBundleElement, props);
        }}
      />
    );
  }
}

export default RouteScene;
