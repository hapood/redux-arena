import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  ARENA_CURTAIN_INIT_SAGA,
  ARENA_CURTAIN_CLEAR_REDUX
} from "../../core/actionTypes";
import { createCurtainReducer } from "../../core/reducers";
import { curtainAddReducer, calcCurtainReducerDict } from "../../utils";
import { arenaCurtainConnect } from "../SceneBundle";

export default class ArenaScene extends Component {
  static contextTypes = {
    store: PropTypes.any,
    arenaReducerDict: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.any,
    reducerKey: PropTypes.string,
    vReducerKey: PropTypes.string,
    sceneBundle: PropTypes.object,
    asyncSceneBundle: PropTypes.object,
    sceneProps: PropTypes.object,
    notifyData: PropTypes.object
  };

  componentWillMount() {
    let reducerKey = curtainAddReducer(
      this.context.store,
      this.props.reducerKey,
      createCurtainReducer
    );
    let {
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      isNotifyOn,
      notifyData
    } = this.props;
    let arenaReducerDict = calcCurtainReducerDict(
      this.context.arenaReducerDict,
      reducerKey,
      this.props.vReducerKey
    );
    let wrappedSceneBundle = arenaCurtainConnect(arenaReducerDict);
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      isNotifyOn,
      notifyData
    });
    this.state = {
      arenaReducerDict,
      wrappedSceneBundle,
      sceneBundleElement,
      sagaTaskPromise: new Promise(resolve =>
        this.context.store.dispatch({
          type: ARENA_CURTAIN_INIT_SAGA,
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
      isNotifyOn,
      notifyData
    } = nextProps;
    let newReducerKey = this.state.arenaReducerDict._arenaCurtain.reducerKey;
    if (
      reducerKey != null &&
      reducerKey !== this.state.arenaReducerDict._arenaCurtain.reducerKey
    ) {
      refreshFlag = true;
      nextContext.store.dispatch({
        type: ARENA_CURTAIN_CLEAR_REDUX,
        reducerKey: this.state.arenaReducerDict._arenaCurtain.reducerKey,
        sagaTaskPromise: this.state.sagaTaskPromise
      });
      newReducerKey = curtainAddReducer(
        nextContext.store,
        reducerKey,
        createCurtainReducer
      );
      this.state.sagaTaskPromise = new Promise(resolve =>
        nextContext.store.dispatch({
          type: ARENA_CURTAIN_INIT_SAGA,
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
      this.state.arenaReducerDict = calcCurtainReducerDict(
        nextContext.arenaReducerDict,
        newReducerKey,
        nextProps.vReducerKey
      );
      this.state.wrappedSceneBundle = arenaCurtainConnect(
        this.state.arenaReducerDict
      );
    }
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      sceneProps !== this.props.sceneBundle ||
      notifyData !== this.props.notifyData ||
      refreshFlag == true
    ) {
      this.setState({
        sceneBundleElement: React.createElement(this.state.wrappedSceneBundle, {
          asyncSceneBundle,
          sceneBundle,
          sceneProps,
          isNotifyOn,
          notifyData
        })
      });
    }
  }

  componentWillUnmount() {
    this.context.store.dispatch({
      type: ARENA_CURTAIN_CLEAR_REDUX,
      reducerKey: this.state.arenaReducerDict._arenaCurtain.reducerKey,
      sagaTaskPromise: this.state.sagaTaskPromise
    });
  }

  render() {
    return this.state.sceneBundleElement;
  }
}
