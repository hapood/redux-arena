import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  SCENESWITCH_INIT_SAGA,
  SCENESWITCH_KILL_SAGA
} from "../redux/actionTypes";
import createSenceSwitchReducer from "../redux/reducers/createSenceSwitchReducer";
import { addReducer } from "../utils";
import { sceneSwitchConnect } from "../SceneBundle";
import SceneLoading from "../SceneLoading";

export default class SceneSwitch extends Component {
  static contextTypes = {
    store: PropTypes.any
  };

  static childContextTypes = {
    sceneMetaKey: PropTypes.string
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
    this.state = {
      reducerKey,
      wrappedSceneBundle: sceneSwitchConnect(
        asyncSceneBundle,
        sceneBundle,
        SceneLoadingComponent,
        reducerKey
      ),
      sagaTaskPromise: new Promise(resolve =>
        this.context.store.dispatch({
          type: SCENESWITCH_INIT_SAGA,
          reducerKey,
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
      (reducerKey != null && reducerKey !== this.state.reducerKey) ||
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      SceneLoadingComponent !== this.props.SceneLoadingComponent
    ) {
      this.context.store.dispatch({
        type: SCENESWITCH_KILL_SAGA,
        sagaTaskPromise: this.sagaTaskPromise
      });
      this.context.store.removeReducer(this.state.reducerKey);
      reducerKey = addReducer(
        this.context.store,
        reducerKey,
        createSenceSwitchReducer
      );
      this.setState({
        reducerKey,
        wrappedSceneBundle: sceneSwitchConnect(
          asyncSceneBundle,
          sceneBundle,
          SceneLoadingComponent,
          reducerKey
        ),
        sagaTaskPromise: new Promise(resolve =>
          this.context.store.dispatch({
            type: SCENESWITCH_INIT_SAGA,
            reducerKey: reducerKey,
            setSagaTask: resolve
          })
        )
      });
    }
  }

  componentWillUnMount() {
    this.context.store.dispatch({
      type: SCENESWITCH_KILL_SAGA,
      sagaTaskPromise: this.state.sagaTaskPromise
    });
    this.context.store.removeReducer(this.state.reducerKey);
  }

  getChildContext() {
    return { sceneMetaKey: this.state.reducerKey };
  }

  render() {
    return this.state.wrappedSceneBundle;
  }
}
