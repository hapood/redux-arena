import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ARENA_CURTAIN_INIT_SAGA,
  ARENA_CURTAIN_CLEAR_REDUX
} from "../../core/actionTypes";
import { createCurtainReducer } from "../../core/reducers";
import {
  curtainAddStateTreeNode,
  curtainAddReducer,
  buildCurtainReducerDict
} from "../../utils";
import { arenaCurtainConnect } from "../SceneBundle";

function buildConnectedBundleComponent(reducerKey) {
  let sagaTaskPromise = new Promise(resolve =>
    store.dispatch({
      type: ARENA_CURTAIN_INIT_SAGA,
      reducerKey,
      setSagaTask: resolve
    })
  );
  return arenaCurtainConnect(reducerKey, () =>
    nextContext.store.dispatch({
      type: ARENA_CURTAIN_CLEAR_REDUX,
      reducerKey,
      sagaTaskPromise
    })
  );
}

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
    let newArenaReducerDict = buildCurtainReducerDict(
      arenaReducerDict,
      newReducerKey,
      vReducerKey
    );
    let ConnectedBundleComponent = buildConnectedBundleComponent(newReducerKey);
    let connectedBundleElement = React.createElement(ConnectedBundleComponent, {
      sceneBundle,
      sceneProps,
      arenaReducerDict: newArenaReducerDict
    });
    this.setState({
      parentReducerKey,
      arenaReducerDict: newArenaReducerDict,
      ConnectedBundleComponent,
      connectedBundleElement
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
      newReducerKey = curtainAddReducer(
        nextContext.store,
        reducerKey,
        createCurtainReducer
      );
      state.ConnectedBundleComponent = buildConnectedBundleComponent(
        newReducerKey
      );
    }
    if (
      nextContext.arenaReducerDict !== this.context.arenaReducerDict ||
      reducerKey !== this.props.reducerKey ||
      vReducerKey !== this.props.vReducerKey ||
      sceneBundle !== this.props.sceneBundle ||
      sceneProps !== this.props.sceneBundle ||
      refreshFlag === true
    ) {
      refreshFlag = true;
      state.arenaReducerDict = buildCurtainReducerDict(
        nextContext.arenaReducerDict,
        newReducerKey,
        nextProps.vReducerKey
      );
      state.connectedBundleElement = React.createElement(
        state.ConnectedBundleComponent,
        {
          sceneBundle,
          sceneProps,
          arenaReducerDict: newArenaReducerDict
        }
      );
    }
    this.setState(state);
  }

  render() {
    return this.state.connectedBundleElement;
  }
}
