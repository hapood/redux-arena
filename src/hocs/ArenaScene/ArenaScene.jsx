import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ARENA_CURTAIN_INIT_SAGA,
  ARENA_CURTAIN_CLEAR_REDUX
} from "../../core/actionTypes";
import { createCurtainReducer } from "../../core/reducers";
import {
  curtainAddStateTreeNode,
  curtainReplaceStateTreeNode,
  curtainDisableStateTreeNode,
  curtainAddReducer,
  calcCurtainReducerDict
} from "../../utils";
import { arenaCurtainConnect } from "../SceneBundle";

function getParentReducerKey(arenaReducerDict) {
  return (
    arenaReducerDict &&
    arenaReducerDict._arenaScene &&
    arenaReducerDict._arenaScene.reducerKey
  );
}

export default class ArenaScene extends Component {
  static contextTypes = {
    store: PropTypes.any,
    arenaReducerDict: PropTypes.object
  };

  static propTypes = {
    reducerKey: PropTypes.string,
    vReducerKey: PropTypes.string,
    sceneBundle: PropTypes.object,
    sceneProps: PropTypes.object
  };

  componentWillMount() {
    let { store, arenaReducerDict } = this.context;
    let { sceneBundle, sceneProps, reducerKey, vReducerKey } = this.props;
    let newReducerKey = curtainAddReducer(
      store,
      reducerKey,
      createCurtainReducer
    );
    let parentReducerKey = getParentReducerKey(arenaReducerDict);
    curtainAddStateTreeNode(store, parentReducerKey, newReducerKey);
    let newArenaReducerDict = calcCurtainReducerDict(
      arenaReducerDict,
      newReducerKey,
      vReducerKey
    );
    let wrappedSceneBundle = arenaCurtainConnect(newArenaReducerDict);
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      sceneBundle,
      sceneProps
    });
    this.setState({
      parentReducerKey,
      arenaReducerDict: newArenaReducerDict,
      wrappedSceneBundle,
      sceneBundleElement,
      sagaTaskPromise: new Promise(resolve =>
        store.dispatch({
          type: ARENA_CURTAIN_INIT_SAGA,
          reducerKey: newReducerKey,
          setSagaTask: resolve
        })
      )
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let refreshFlag = false;
    let state = Object.assign({}, this.state);
    let { reducerKey, vReducerKey, sceneBundle, sceneProps } = nextProps;
    let curReducerKey = state.arenaReducerDict._arenaCurtain.reducerKey;
    let newReducerKey = curReducerKey;
    if (reducerKey != null && reducerKey !== curReducerKey) {
      refreshFlag = true;
      nextContext.store.dispatch({
        type: ARENA_CURTAIN_CLEAR_REDUX,
        reducerKey: curReducerKey,
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
    if (refreshFlag === true) {
      let curReducerKey = this.state.arenaReducerDict._arenaCurtain.reducerKey;
      curtainReplaceStateTreeNode(store, curReducerKey, newReducerKey);
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
      sceneBundle !== this.props.sceneBundle ||
      sceneProps !== this.props.sceneBundle ||
      refreshFlag == true
    ) {
      state.sceneBundleElement = React.createElement(state.wrappedSceneBundle, {
        sceneBundle,
        sceneProps
      });
    }
    this.setState(state);
  }

  componentWillUnmount() {
    let curReducerKey = this.state.arenaReducerDict._arenaCurtain.reducerKey;
    curtainDisableStateTreeNode(this.context.store, curReducerKey);
    this.context.store.dispatch({
      type: ARENA_CURTAIN_CLEAR_REDUX,
      reducerKey: curReducerKey,
      sagaTaskPromise: this.state.sagaTaskPromise
    });
  }

  render() {
    return this.state.sceneBundleElement;
  }
}
