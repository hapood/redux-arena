import ActionTypes from "../ActionTypes";
import {
  put,
  PutEffect,
  fork,
  ForkEffect,
  select,
  SelectEffect,
  getContext,
  setContext,
  CallEffectFactory,
  GetContextEffect
} from "redux-saga/effects";
import { bindActionCreators, ActionCreatorsMapObject, Dispatch } from "redux";
import { bindArenaActionCreators } from "../enhancedRedux";
import { createSceneReducer, sceneReducerWrapper } from "../reducers";
import {
  addStateTreeNode,
  sceneAddReducer,
  sceneReplaceReducer,
  buildSceneReducerDict
} from "../../utils";
import {
  ReducerDict,
  SceneReducer,
  SceneBundleOptions,
  SceneBundle
} from "../types";
import { CurtainReduxInfo } from "../reducers/types";

const defaultActions = {
  setState: (state: any) => ({ type: ActionTypes.ARENA_SCENE_SET_STATE, state })
};

function bindActions(
  actions: ActionCreatorsMapObject | null | undefined,
  reducerKey: string,
  dispatch: Dispatch<any>,
  isSceneActions: boolean
) {
  if (isSceneActions === false) {
    return bindActionCreators(actions || defaultActions, dispatch);
  } else {
    return bindArenaActionCreators(
      actions || defaultActions,
      dispatch,
      reducerKey
    );
  }
}

function* forkSagaWithContext(saga: () => null, ctx: any) {
  yield setContext(ctx);
  yield fork(saga);
}

function buildReducerFactory<S = {}>(
  reducer: SceneReducer<S> | null | undefined,
  state: S | null | undefined,
  isSceneReducer: boolean
) {
  return isSceneReducer === false
    ? (bindingReducerKey: string) =>
        createSceneReducer(reducer, state, bindingReducerKey)
    : (bindingReducerKey: string) =>
        createSceneReducer(
          reducer && sceneReducerWrapper(reducer),
          state,
          bindingReducerKey
        );
}

function getParentReducerKey(arenaReducerDict: ReducerDict) {
  return (
    arenaReducerDict &&
    arenaReducerDict._arenaCurtain &&
    arenaReducerDict._arenaCurtain.reducerKey
  );
}

export interface ApplyReduxPayload<P, S, CP> {
  arenaReducerDict: ReducerDict;
  state: {} | null | undefined;
  saga: ((...params: any[]) => any) | null | undefined;
  actions: ActionCreatorsMapObject | null | undefined;
  reducer: SceneReducer | null | undefined;
  options: SceneBundleOptions | null | undefined;
}

export function* sceneApplyRedux<P, S, CP>({
  arenaReducerDict,
  state,
  saga,
  actions,
  reducer,
  options
}: ApplyReduxPayload<P, S, CP>): any {
  let curOptions = options || {};
  let arenaStore = yield getContext("store");
  let reducerFactory = buildReducerFactory(
    reducer,
    state,
    curOptions.isSceneReducer === false ? false : true
  );
  let newReducerKey = sceneAddReducer(
    arenaStore,
    curOptions.reducerKey,
    reducerFactory,
    state
  );
  let bindedActions = bindActions(
    actions,
    newReducerKey,
    arenaStore.dispatch,
    curOptions.isSceneActions === false ? false : true
  );
  let newArenaReducerDict = buildSceneReducerDict(
    arenaReducerDict,
    newReducerKey,
    curOptions.vReducerKey,
    bindedActions
  );
  let newReduxInfo = {
    reducerKey: newReducerKey,
    origArenaReducerDict: arenaReducerDict,
    actions,
    options: curOptions,
    saga,
    bindedActions,
    arenaReducerDict: newArenaReducerDict
  };
  addStateTreeNode(
    arenaStore,
    getParentReducerKey(newReduxInfo.arenaReducerDict),
    newReducerKey
  );
  if (saga) {
    newReduxInfo.saga = yield fork(forkSagaWithContext, saga, {
      arenaReducerDict: newReduxInfo.arenaReducerDict
    });
  }
  return newReduxInfo as CurtainReduxInfo<S>;
}
export interface UpdateReduxPayload<P, S, CP>
  extends ApplyReduxPayload<P, S, CP> {
  curSceneBundle: SceneBundle<P, S, CP>;
  reduxInfo: CurtainReduxInfo<S>;
}

export function* sceneUpdateRedux<P, S, CP>({
  arenaReducerDict,
  state,
  saga,
  actions,
  reducer,
  options,
  curSceneBundle,
  reduxInfo
}: UpdateReduxPayload<P, S, CP>): any {
  let curOptions = options || {};
  let newReducerKey = reduxInfo.reducerKey;
  let arenaStore = yield getContext("store");
  let reducerFactory = buildReducerFactory(
    reducer,
    state,
    curOptions.isSceneReducer === false ? false : true
  );
  let newReduxInfo = Object.assign({}, reduxInfo, { options: curOptions });
  if (
    curOptions.reducerKey != null &&
    curOptions.reducerKey !== reduxInfo.reducerKey
  ) {
    let oldState = yield select((state: any) => state[reduxInfo.reducerKey]);
    newReducerKey = sceneAddReducer(
      arenaStore,
      curOptions.reducerKey,
      reducerFactory,
      state === curSceneBundle.state ? oldState : state
    );
    addStateTreeNode(
      arenaStore,
      getParentReducerKey(newReduxInfo.arenaReducerDict),
      newReducerKey
    );
  } else if (curOptions.reducerKey === reduxInfo.reducerKey) {
    if (
      reducer !== curSceneBundle.reducer ||
      curOptions.isSceneReducer !== reduxInfo.options.isSceneReducer
    ) {
      newReducerKey = sceneReplaceReducer(
        arenaStore,
        reduxInfo.reducerKey,
        reducerFactory,
        state === curSceneBundle.state ? null : state
      );
    } else if (state !== curSceneBundle.state) {
      arenaStore.dispatch({
        type: ActionTypes.ARENA_SCENE_REPLACE_STATE,
        _sceneReducerKey: newReducerKey,
        state
      });
    }
  } else if (state !== curSceneBundle.state) {
    yield put({
      type: ActionTypes.ARENA_SCENE_REPLACE_STATE,
      _sceneReducerKey: newReducerKey,
      state
    });
  }
  newReduxInfo.reducerKey = newReducerKey;
  if (
    actions !== reduxInfo.actions ||
    curOptions.isSceneActions !== reduxInfo.options.isSceneActions
  ) {
    newReduxInfo.actions = actions;
    newReduxInfo.bindedActions = bindActions(
      actions,
      newReducerKey,
      arenaStore.dispatch,
      curOptions.isSceneActions === false ? false : true
    );
  }
  if (
    newReducerKey !== reduxInfo.reducerKey ||
    curOptions.vReducerKey !== reduxInfo.options.vReducerKey ||
    arenaReducerDict !== reduxInfo.origArenaReducerDict
  ) {
    newReduxInfo.arenaReducerDict = buildSceneReducerDict(
      arenaReducerDict,
      newReducerKey,
      curOptions.vReducerKey,
      newReduxInfo.actions
    );
  }
  if (saga) {
    newReduxInfo.saga = yield fork(forkSagaWithContext, saga, {
      arenaReducerDict: newReduxInfo.arenaReducerDict
    });
  }
  return newReduxInfo as CurtainReduxInfo<S>;
}
