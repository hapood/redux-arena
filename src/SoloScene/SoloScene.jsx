import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  ARENASWITCH_INIT_SAGA,
  ARENASWITCH_KILL_SAGA
} from "../redux/actionTypes";
import createArenaSwitchReducer from "../redux/reducers/createArenaSwitchReducer";
import { switchAddReducer, switchRmAndAddReducer } from "../utils";
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
      SceneLoadingComponent
    } = this.props;
    let arenaReducerDict = this.calcNewReducerKeyDict(
      this.context.arenaReducerDict,
      reducerKey
    );
    let wrappedSceneBundle = arenaSwitchConnect(arenaReducerDict);
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      SceneLoadingComponent
    });
    this.state = {
      arenaReducerDict,
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

  componentWillReceiveProps(nextProps, nextContext) {
    let refreshFlag = false;
    let {
      reducerKey,
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      SceneLoadingComponent
    } = nextProps;
    if (
      reducerKey != null &&
      reducerKey !== this.state.arenaReducerDict._curSwitch.reducerKey
    ) {
      refreshFlag = true;
      this.context.store.dispatch({
        type: ARENASWITCH_KILL_SAGA,
        sagaTaskPromise: this.state.sagaTaskPromise
      });
      reducerKey = switchRmAndAddReducer(
        this.context.store,
        this.state.arenaReducerDict._curSwitch.reducerKey,
        reducerKey,
        createArenaSwitchReducer
      );
      this.state.sagaTaskPromise = new Promise(resolve =>
        this.context.store.dispatch({
          type: ARENASWITCH_INIT_SAGA,
          reducerKey,
          setSagaTask: resolve
        })
      );
    } else {
      reducerKey = this.state.arenaReducerDict._curSwitch.reducerKey;
    }
    if (
      nextContext.arenaReducerDict !== this.context.arenaReducerDict ||
      refreshFlag === true
    ) {
      refreshFlag = true;
      this.state.arenaReducerDict = this.calcNewReducerKeyDict(
        nextContext.arenaReducerDict,
        reducerKey
      );
      this.state.wrappedSceneBundle = arenaSwitchConnect(
        this.state.arenaReducerDict
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
          sceneProps,
          SceneLoadingComponent
        }
      );
    }
  }

  calcNewReducerKeyDict(arenaReducerDict, switchReducerKey) {
    let newDict = Object.assign({}, arenaReducerDict);
    let item = { actions: {}, reducerKey: switchReducerKey };
    if (this.props.reducerKey) {
      newDict[this.props.reducerKey] = item;
    }
    if (this.props.vReducerKey) {
      newDict[this.props.vReducerKey] = item;
    }
    newDict._curSwitch = item;
    newDict._curScene = null;
    return newDict;
  }

  componentWillUnmount() {
    this.context.store.dispatch({
      type: ARENASWITCH_KILL_SAGA,
      sagaTaskPromise: this.state.sagaTaskPromise
    });
    this.context.store.removeReducer(
      this.state.arenaReducerDict._curSwitch.reducerKey
    );
  }

  render() {
    return this.state.sceneBundleElement;
  }
}
