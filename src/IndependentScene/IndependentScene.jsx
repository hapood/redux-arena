import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  SCENESWITCH_INIT_SAGA,
  SCENESWITCH_KILL_SAGA
} from "../redux/actionTypes";
import createSenceSwitchReducer from "../redux/reducers/createSenceSwitchReducer";
import { addReducer, removeAndAddReducer } from "../utils";
import { sceneSwitchConnect } from "../SceneBundle";
import SceneLoading from "../SceneLoading";

export default class IndependentScene extends Component {
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
      createSenceSwitchReducer
    );
    let { asyncSceneBundle, sceneBundle, SceneLoadingComponent } = this.props;
    let wrappedSceneBundle = sceneSwitchConnect(reducerKey);
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent
    });
    this.state = {
      sceneSwitchReducerKey: reducerKey,
      wrappedSceneBundle,
      sceneBundleElement,
      sagaTaskPromise: new Promise(resolve =>
        this.context.store.dispatch({
          type: SCENESWITCH_INIT_SAGA,
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
    if (reducerKey != null && reducerKey !== this.state.sceneSwitchReducerKey) {
      refreshFlag = true;
      this.context.store.dispatch({
        type: SCENESWITCH_KILL_SAGA,
        sagaTaskPromise: this.state.sagaTaskPromise
      });
      reducerKey = removeAndAddReducer(
        this.context.store,
        this.state.sceneSwitchReducerKey,
        reducerKey,
        createSenceSwitchReducer
      );
      this.state.sceneSwitchReducerKey = reducerKey;
      this.state.sagaTaskPromise = new Promise(resolve =>
        this.context.store.dispatch({
          type: SCENESWITCH_INIT_SAGA,
          reducerKey,
          setSagaTask: resolve
        })
      );
      this.state.wrappedSceneBundle = sceneSwitchConnect(
        this.state.sceneSwitchReducerKey
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
      type: SCENESWITCH_KILL_SAGA,
      sagaTaskPromise: this.state.sagaTaskPromise
    });
    this.context.store.removeReducer(this.state.sceneSwitchReducerKey);
  }

  render() {
    return this.state.sceneBundleElement;
  }
}
