import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  SCENESWITCH_INIT_SAGA,
  SCENESWITCH_KILL_SAGA
} from "../redux/actionTypes";
import createSenceSwitchReducer from "../redux/reducers/createSenceSwitchReducer";
import { addReducer, removeAndSetReducer } from "../utils";
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
    sceneSwitchCtx = { reducerKey };
    this.state = {
      sceneSwitchCtx,
      wrappedSceneBundle: sceneSwitchConnect(
        asyncSceneBundle,
        sceneBundle,
        SceneLoadingComponent,
        sceneSwitchCtx
      ),
      sagaTaskPromise: new Promise(resolve =>
        this.context.store.dispatch({
          type: SCENESWITCH_INIT_SAGA,
          sceneSwitchCtx,
          setSagaTask: resolve
        })
      )
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let {
      reducerKey,
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent
    } = nextContext;
    if (
      reducerKey != null &&
      reducerKey !== this.state.sceneSwitchCtx.reducerKey
    ) {
      reducerKey = removeAndSetReducer(
        this.context.store,
        this.state.sceneSwitchCtx.reducerKey,
        reducerKey,
        createSenceSwitchReducer
      );
      this.state.sceneSwitchCtx.reducerKey = reducerKey;
    }
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      SceneLoadingComponent !== this.props.SceneLoadingComponent
    ) {
      this.setState({
        wrappedSceneBundle: sceneSwitchConnect(
          asyncSceneBundle,
          sceneBundle,
          SceneLoadingComponent,
          sceneSwitchCtx
        )
      });
    }
  }

  componentWillUnmount() {
    this.context.store.dispatch({
      type: SCENESWITCH_KILL_SAGA,
      sagaTaskPromise: this.state.sagaTaskPromise
    });
    this.context.store.removeReducer(this.state.sceneSwitchCtx.reducerKey);
  }

  render() {
    return this.state.wrappedSceneBundle;
  }
}
