import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import invariant from "invariant";
import SoloScene from "../SoloScene";
import syncSwitchState from "./syncSwitchState";

class RouteScene extends Component {
  static contextTypes = {
    store: PropTypes.any
  };

  static propTypes = {
    reducerKey: PropTypes.string,
    vReducerKey: PropTypes.string,
    asyncSceneBuldle: PropTypes.any,
    sceneBundle: PropTypes.any,
    sceneProps: PropTypes.object,
    isNotifyOn: PropTypes.bool,
    notifyData: PropTypes.object,
    exact: PropTypes.bool,
    path: PropTypes.string,
    strict: PropTypes.bool
  };

  static defaultProps = {
    isNotifyOn: true,
    exact: true
  };

  componentWillMount() {
    let { store } = this.context;
    let { asyncSceneBundle, sceneBundle, sceneProps } = this.props;
    let SceneHOC = syncSwitchState(SoloScene);
    this.state = {
      SceneHOC
    };
  }

  render() {
    let {
      exact,
      strict,
      path,
      computedMatch,
      location,
      notifyData,
      isNotifyOn,
      reducerKey,
      vReducerKey,
      asyncSceneBundle,
      sceneBundle,
      sceneProps
    } = this.props;
    let { store } = this.context;
    return (
      <Route
        location={location}
        computedMatch={computedMatch}
        exact={exact}
        path={path}
        strict={strict}
        render={props => {
          return React.createElement(this.state.SceneHOC, {
            key: path,
            isNotifyOn,
            store,
            notifyData: Object.assign({}, props, notifyData),
            reducerKey,
            vReducerKey,
            asyncSceneBundle,
            sceneBundle,
            sceneProps
          });
        }}
      />
    );
  }
}

export default RouteScene;
