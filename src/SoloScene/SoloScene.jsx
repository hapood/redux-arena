import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  ARENASWITCH_INIT_SAGA,
  ARENASWITCH_KILL_SAGA
} from "../redux/actionTypes";
import createArenaSwitchReducer from "../redux/reducers/createArenaSwitchReducer";
import { addReducer, removeAndAddReducer } from "../utils";
import { arenaSwitchConnect } from "../SceneBundle";
import SceneLoading from "../SceneLoading";

export default class SoloScene extends Component {
  static contextTypes = {
    store: PropTypes.any
  };

  static propTypes = {
    children: PropTypes.any,
    reducerKey: PropTypes.string,
    asyncSceneBuldle: PropTypes.any,
    scene: PropTypes.any,
    SceneLoadingComponent: PropTypes.any
  };

  static defaultProps = {
    SceneLoadingComponent: SceneLoading
  };

  componentWillMount() {
    let reducerKey = addReducer(
      this.context.store,
      this.props.reducerKey,
      createArenaSwitchReducer
    );
    let { asyncSceneBundle, sceneBundle, SceneLoadingComponent } = this.props;
    let wrappedSceneBundle = arenaSwitchConnect(reducerKey);
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent
    });
    this.state = {
      arenaSwitchReducerKey: reducerKey,
      wrappedSceneBundle,
      sceneBundleElement,
      sagaTaskPromise: new Promise(resolve =>
        this.context.store.dispatch({
          type: ARENASWITCH_INIT_SAGA,
          reducerKey,
          setSagaTask: resolve
        })
      )
    };
  }

  componentWillReceiveProps(nextProps) {
    let refreshFlag = false;
    let {
      reducerKey,
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent
    } = nextProps;
    if (reducerKey != null && reducerKey !== this.state.arenaSwitchReducerKey) {
      refreshFlag = true;
      this.context.store.dispatch({
        type: ARENASWITCH_KILL_SAGA,
        sagaTaskPromise: this.state.sagaTaskPromise
      });
      reducerKey = removeAndAddReducer(
        this.context.store,
        this.state.arenaSwitchReducerKey,
        reducerKey,
        createArenaSwitchReducer
      );
      this.state.arenaSwitchReducerKey = reducerKey;
      this.state.sagaTaskPromise = new Promise(resolve =>
        this.context.store.dispatch({
          type: ARENASWITCH_INIT_SAGA,
          reducerKey,
          setSagaTask: resolve
        })
      );
      this.state.wrappedSceneBundle = arenaSwitchConnect(
        this.state.arenaSwitchReducerKey
      );
    }
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      SceneLoadingComponent !== this.props.SceneLoadingComponent ||
      refreshFlag == true
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

  componentWillUnmount() {
    this.context.store.dispatch({
      type: ARENASWITCH_KILL_SAGA,
      sagaTaskPromise: this.state.sagaTaskPromise
    });
    this.context.store.removeReducer(this.state.arenaSwitchReducerKey);
  }

  render() {
    return this.state.sceneBundleElement;
  }
}
