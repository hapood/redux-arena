import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  ARENA_SWITCH_INIT_SAGA,
  ARENA_SWITCH_CLEAR_REDUX
} from "../../core/actionTypes";
import createArenaSwitchReducer from "../../core/reducers/createArenaSwitchReducer";
import {
  switchAddReducer,
  switchRmAndAddReducer,
  calcSwitchReducerDict
} from "../../utils";
import { arenaSwitchConnect } from "../SceneBundle";

export default class SoloScene extends Component {
  static contextTypes = {
    store: PropTypes.any,
    arenaReducerDict: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.any,
    reducerKey: PropTypes.string,
    sceneBundle: PropTypes.object,
    asyncSceneBuldle: PropTypes.object,
    sceneProps: PropTypes.object,
    notifyData: PropTypes.object,
    SceneLoadingComponent: PropTypes.any
  };

  componentWillMount() {
    let reducerKey = switchAddReducer(
      this.context.store,
      this.props.reducerKey,
      createArenaSwitchReducer
    );
    let {
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      notifyData,
      SceneLoadingComponent
    } = this.props;
    let arenaReducerDict = calcSwitchReducerDict(
      this.context.arenaReducerDict,
      reducerKey,
      this.props.vReducerKey
    );
    let wrappedSceneBundle = arenaSwitchConnect(arenaReducerDict);
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      notifyData,
      SceneLoadingComponent
    });
    this.state = {
      arenaReducerDict,
      wrappedSceneBundle,
      sceneBundleElement,
      sagaTaskPromise: new Promise(resolve =>
        this.context.store.dispatch({
          type: ARENA_SWITCH_INIT_SAGA,
          reducerKey,
          setSagaTask: resolve
        })
      )
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let refreshFlag = false;
    let {
      reducerKey,
      vReducerKey,
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      notifyData,
      SceneLoadingComponent
    } = nextProps;
    let newReducerKey = this.state.arenaReducerDict._curSwitch.reducerKey;
    if (
      reducerKey != null &&
      reducerKey !== this.state.arenaReducerDict._curSwitch.reducerKey
    ) {
      refreshFlag = true;
      this.context.store.dispatch({
        type: ARENA_SWITCH_CLEAR_REDUX,
        sagaTaskPromise: this.state.sagaTaskPromise
      });
      newReducerKey = switchRmAndAddReducer(
        this.context.store,
        this.state.arenaReducerDict._curSwitch.reducerKey,
        reducerKey,
        createArenaSwitchReducer
      );
      this.state.sagaTaskPromise = new Promise(resolve =>
        this.context.store.dispatch({
          type: ARENA_SWITCH_INIT_SAGA,
          reducerKey: newReducerKey,
          setSagaTask: resolve
        })
      );
    }
    if (
      nextContext.arenaReducerDict !== this.context.arenaReducerDict ||
      reducerKey !== this.props.reducerKey ||
      vReducerKey !== this.props.vReducerKey ||
      refreshFlag === true
    ) {
      refreshFlag = true;
      this.state.arenaReducerDict = calcSwitchReducerDict(
        nextContext.arenaReducerDict,
        newReducerKey,
        nextProps.vReducerKey
      );
      this.state.wrappedSceneBundle = arenaSwitchConnect(
        this.state.arenaReducerDict
      );
    }
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      sceneProps !== this.props.sceneBundle ||
      SceneLoadingComponent !== this.props.SceneLoadingComponent ||
      notifyData !== this.props.notifyData ||
      refreshFlag == true
    ) {
      this.setState({
        sceneBundleElement: React.createElement(this.state.wrappedSceneBundle, {
          asyncSceneBundle,
          sceneBundle,
          sceneProps,
          notifyData,
          SceneLoadingComponent
        })
      });
    }
  }

  componentWillUnmount() {
    this.context.store.dispatch({
      type: ARENA_SWITCH_CLEAR_REDUX,
      reducerKey: this.state.arenaReducerDict._curSwitch.reducerKey,
      sagaTaskPromise: this.state.sagaTaskPromise
    });
  }

  render() {
    return this.state.sceneBundleElement;
  }
}
