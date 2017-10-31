import * as React from "react";
import * as PropTypes from "prop-types";
import { EnhancedStore, ReducerDict } from "../../core";
import ActionTypes from "../../core/ActionTypes";
import { createCurtainReducer } from "../../core/reducers";
import {
  addStateTreeNode,
  curtainAddReducer,
  buildCurtainReducerDict
} from "../../utils";
import { curtainConnect } from "../BundleComponent";
import { Props, State, Context } from "./types";

function buildConnectedSceneBundle(
  reducerKey: string,
  store: EnhancedStore<any>
) {
  let sagaTaskPromise = new Promise(resolve =>
    store.dispatch({
      type: ActionTypes.ARENA_CURTAIN_INIT_SAGA,
      reducerKey,
      setSagaTask: resolve
    })
  );
  return curtainConnect(reducerKey, () =>
    store.dispatch({
      type: ActionTypes.ARENA_CURTAIN_CLEAR_REDUX,
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

export default class ArenaScene extends React.Component<Props, State> {
  static contextTypes = {
    store: PropTypes.any,
    arenaReducerDict: PropTypes.object
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
    let ConnectedBundleComponent = buildConnectedSceneBundle(
      newReducerKey,
      this.context.store
    );
    let connectedBundleElement = React.createElement(ConnectedBundleComponent, {
      arenaReducerDict: newArenaReducerDict,
      sceneBundle,
      sceneProps
    });
    this.setState({
      parentReducerKey,
      arenaReducerDict: newArenaReducerDict,
      ConnectedBundleComponent,
      connectedBundleElement
    });
  }

  componentWillReceiveProps(nextProps: Props, nextContext: Context) {
    let refreshFlag = false;
    let state: State = Object.assign({}, this.state);
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
      addStateTreeNode(
        nextContext.store,
        this.state.parentReducerKey,
        newReducerKey
      );
      state.ConnectedBundleComponent = buildConnectedSceneBundle(
        newReducerKey,
        nextContext.store
      );
    }
    if (
      nextContext.arenaReducerDict !== this.context.arenaReducerDict ||
      reducerKey !== this.props.reducerKey ||
      vReducerKey !== this.props.vReducerKey ||
      sceneBundle !== this.props.sceneBundle ||
      sceneProps !== this.props.sceneProps ||
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
