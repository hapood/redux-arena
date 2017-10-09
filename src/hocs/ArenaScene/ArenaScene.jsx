import React, { Component } from "react";
import PropTypes from "prop-types";
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
    reducerKey: PropTypes.string,
    vReducerKey: PropTypes.string,
    sceneBundle: PropTypes.object,
    asyncSceneBundle: PropTypes.object,
    sceneProps: PropTypes.object,
    isNotifyOn: PropTypes.bool,
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
    this.setState({
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
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let refreshFlag = false;
    let state = Object.assign({}, this.state);
    let {
      reducerKey,
      vReducerKey,
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      isNotifyOn,
      notifyData
    } = nextProps;
    let newReducerKey = state.arenaReducerDict._arenaCurtain.reducerKey;
    if (
      reducerKey != null &&
      reducerKey !== state.arenaReducerDict._arenaCurtain.reducerKey
    ) {
      refreshFlag = true;
      nextContext.store.dispatch({
        type: ARENA_CURTAIN_CLEAR_REDUX,
        reducerKey: state.arenaReducerDict._arenaCurtain.reducerKey,
        sagaTaskPromise: state.sagaTaskPromise
      });
      newReducerKey = curtainAddReducer(
        nextContext.store,
        reducerKey,
        createCurtainReducer
      );
      state.sagaTaskPromise = new Promise(resolve =>
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
      state.arenaReducerDict = calcCurtainReducerDict(
        nextContext.arenaReducerDict,
        newReducerKey,
        nextProps.vReducerKey
      );
      state.wrappedSceneBundle = arenaCurtainConnect(state.arenaReducerDict);
    }
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      sceneProps !== this.props.sceneBundle ||
      notifyData !== this.props.notifyData ||
      refreshFlag == true
    ) {
      state.sceneBundleElement = React.createElement(state.wrappedSceneBundle, {
        asyncSceneBundle,
        sceneBundle,
        sceneProps,
        isNotifyOn,
        notifyData
      });
    }
    this.setState(state);
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
