import { Component, SFC, createElement, SFCElement } from "react";
import * as PropTypes from "prop-types";
import { EhancedStore, ReducerDict, SceneBundle } from "../../core";
import { actionTypes } from "../../core/actionTypes";
import { createCurtainReducer } from "../../core/reducers";
import {
  addStateTreeNode,
  curtainAddReducer,
  buildCurtainReducerDict
} from "../../utils";
import { arenaCurtainConnect } from "../SceneBundle";

export type SceneProp = {
  sceneBundle: SceneBundle;
  sceneProps: any;
  reducerKey: string;
  vReducerKey: string;
};

export type SceneState = {
  parentReducerKey: string;
  arenaReducerDict: ReducerDict;
  ConnectedBundleComponent: SFC<any>;
  connectedBundleElement: SFCElement<any>;
};

function buildConnectedBundleComponent(
  reducerKey: string,
  store: EhancedStore<any>
) {
  let sagaTaskPromise = new Promise(resolve =>
    store.dispatch({
      type: actionTypes.ARENA_CURTAIN_INIT_SAGA,
      reducerKey,
      setSagaTask: resolve
    })
  );
  return arenaCurtainConnect<SceneProp>(reducerKey, () =>
    store.dispatch({
      type: actionTypes.ARENA_CURTAIN_CLEAR_REDUX,
      reducerKey,
      sagaTaskPromise
    })
  );
}

function getParentReducerKey(arenaReducerDict: ReducerDict) {
  return (
    arenaReducerDict &&
    arenaReducerDict._arenaScene &&
    arenaReducerDict._arenaScene.reducerKey
  );
}

export default class ArenaScene extends Component<SceneProp, SceneState> {
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
    addStateTreeNode(store, parentReducerKey, newReducerKey);
    let newArenaReducerDict = buildCurtainReducerDict(
      arenaReducerDict,
      newReducerKey,
      vReducerKey
    );
    let ConnectedBundleComponent = buildConnectedBundleComponent(
      newReducerKey,
      this.context.store
    );
    let connectedBundleElement = createElement(ConnectedBundleComponent, {
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
      addStateTreeNode(store, this.state.parentReducerKey, newReducerKey);
      state.ConnectedBundleComponent = buildConnectedBundleComponent(
        newReducerKey,
        nextContext.store
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
          arenaReducerDict: state.arenaReducerDict
        }
      );
    }
    this.setState(state);
  }

  render() {
    return this.state.connectedBundleElement;
  }
}
