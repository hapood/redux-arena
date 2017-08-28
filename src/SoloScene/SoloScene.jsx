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
    store: PropTypes.any,
    arenaReducerDict: PropTypes.object
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
    let arenaReducerDict = this.calcNewReducerKeyDict(
      this.context.arenaReducerDict,
      reducerKey
    );
    let wrappedSceneBundle = arenaSwitchConnect(arenaReducerDict);
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      asyncSceneBundle,
      sceneBundle,
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
    this.context.store.removeReducer(this.state.arenaSwitchReducerKey);
  }

  render() {
    return this.state.sceneBundleElement;
  }
}
