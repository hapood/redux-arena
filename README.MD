# redux-arena

[![Build Status](https://travis-ci.org/hapood/redux-arena.svg?branch=master)](https://travis-ci.org/hapood/redux-arena) 
[![Coverage Status](https://coveralls.io/repos/github/hapood/redux-arena/badge.svg?branch=master)](https://coveralls.io/github/hapood/redux-arena?branch=master)
[![npm version](https://img.shields.io/npm/v/redux-arena.svg?style=flat-square)](https://www.npmjs.com/package/redux-arena)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)

Redux is a great state management container, which is elaborate and can be easily extent. But there are some problems when resuing a React component binded with Redux, refs to [RFC: Reuse complex components implemented in React plus Redux #278](https://github.com/reactjs/react-redux/issues/278).

## Features

Redux-Arena will export Redux/Redux-Saga code with React component as a high order component for reuse:
1. When hoc is mounted, it will start Redux-Saga task, initializing reducer of component, and register node on state. 
2. When hoc is unmounted, it will cancel Redux-Saga task, destroy reducer of component, and delete node on state.
3. Reducer of component will only accept actions dispatched by current component by default. Revert reducer to accept all actions by set options. 
4. Virtual ReducerKey: Sharing state in Redux will know the node's name of state, it will cause name conflict when reuse hoc sometime. Using vReducerKey will never cause name conflict, same vReducerKey will be replaced by child hoc.
5. Like one-way data flow of Flux, child hoc could get state and actions of parent by vReducerKey.
6. Integration deeply with Redux-Saga, accept actions dispatched by current component and set state of current component is more easily.

Integration with React-Router is included.

## Install

```
npm install redux-arena --save
```

## [Example](https://hapood.github.io/redux-arena/)

A complete example is under `/example` directory, including a lot of HOC. And add redux-devtools for state changing show.
Online example can be found here: [Here](https://hapood.github.io/redux-arena/)

### Screenshots
<img src="https://raw.githubusercontent.com/hapood/redux-arena/d6c324d44636d19e7c2b824d295620053c73b1f6/redux-arena-demo.gif" width="800"/>

## Quick Start

1. Export react component, actions, reducer, saga as React component.

```javascript
import { bundleToComponent } from "redux-arena/tools";
import state from "./state";
import saga from "./saga";
import * as actions from "./actions";
import PageA from "./PageA";

export default bundleToComponent({
  Component: PageA,
  state,
  saga,
  actions
})
```

2. Initial arenaStore and provide it for redux. PageA Component is exported in last step.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createArenaStore } from "redux-arena";
import PageA from "./pageA";

let store = createArenaStore();

let app = document.getElementById("app");
ReactDOM.render(
  <Provider store={store}>
    <PageA />
  </Provider>,
  app
);
```

# API Reference

* [`EnhancedRedux API`](#enhancedredux-api)
  * [`createArenaStore(reducers, initialStates, enhencers, sagaOptions): enhancedStore`](#createarenastorereducers-initialstates-enhancers-sagaoptions-enhancedstore)
* [`Bundle API`](#bundle-api)
* [`HOC API`](#hoc-api)
  * [`<ArenaScene />`](#arenascene)
  * [`<ArenaSceneMotion />`](#arenascenemotion)
* [`Tools API`](#tools-api)
  * [`bundleToComponent(bundle, extraProps)`](#bundletocomponentbundle-extraProps)
  * [`bundleToElement(bundle, props, extraProps)`](#asyncbundletoelementasyncbundle-props-extraProps)
* [`Saga API`](#tools-api)
  * [`getSceneState()`](#getscenestate)
  * [`getSceneActions()`](#getsceneactions)
  * [`putSceneAction(action)`](#putsceneactionaction)
  * [`setSceneState(state)`](#setscenestatestate)
  * [`takeEverySceneAction(pattern, saga, ...args)`](#takeeverysceneactionpattern-saga-args)
  * [`takeLatestSceneAction(pattern, saga, ..args)`](#takelatestsceneactionpattern-saga-args)
  * [`takeSceneAction(pattern)`](#takesceneactionpattern)

## EnhancedRedux API

### `createArenaStore(reducers, initialStates, enhancers, sagaOptions): enhancedStore`

Creates a enhanced redux store for redux-arena

- `reducers: object` - A set of reducers.

   **Example**
   
     ```javascript
     {
       frame: (state)=>state,
       page: (state)=>state,
       ...
     }
     ```

- `initialStates: object` - A set of initial states.

   **Example**

    ```javascript
     {
       frame: { location:"/" },
       page: { cnt:0 },
       ...
     }
    ```


- `enhencers: array` - An array of redux enhencers.

    **Example**

    ```javascript
    import { applyMiddleware } from "redux";
    import thunk from "redux-thunk";

    let enhancers = [applyMiddleware(thunk)];
    ```

- `sagaOptions：object` - Options used for redux-saga.

- `enhancedStore：object` - An enhanced redux store which owning following method.

  - `runSaga(saga)` -  start a saga task.


## Bundle API

A Bundle is an object which contains react-component, actions, reducer, saga and options, used for ArenaScene high order component.

**Example**

```javascript
import state from "./state";
import saga from "./saga";
import * as actions from "./actions";
import Component from "./Component";

export default {
  Component,
  state,
  saga,
  actions,
  options:{
    vReducerkey:"vKey1"
  }
}
```
### `createArenaStore(reducers, initialStates, enhencers, sagaOptions): enhancedStore`

- `Component: React.Component` - React component for binding redux.

- `state: object` - Initial state of bundle.

- `actions: object` - Same as redux's actions, connected with redux when component be mounted.

- `saga: function*` - Generator of redux-Ssga, initialize when component be mounted.

- `options: object` - Options of bundle.

  - `reducerKey: string` - Specify a fixed reducer key for bundle.

  - `vReducerKey: string` - Specify a fixed vitural reducer key for bundle.

  - `isSceneAction: bool` - If false, "_sceneReducerKey" will not add to actions in bundle.

  - `isSceneReducer: bool` - If false, reducer will accept actions dispatched by other bundle.

## HOC API

### `<ArenaScene />`

A container for transforming bundle to a plain react element. Props is explained following:

- `sceneBundle: object` - Sync bundle for loading.

- `sceneProps: object` - Props of bundle's Component.

- `reducerKey: string` - Specify a fixed reducer key for container.

- `vReducerKey: string` - Specify a fixed vitural reducer key for container.

### `<ArenaSceneMotion />`

Loading Animation Frame for ArenaScene. Props is explained following:

- `children: element` - Element of ArenaScene rendered.

- `asyncBundleThunk: () => Promise` - function for async loading bundle.

- `loadingPlay: element` - Element of loading animation.

- `initStyles: object` - Initial style of container, loadingPlay and scenePlay.

- `styleCalculators: object` - Style calculators of container, loadingPlay and scenePlay.

- `numberToStyle: object` - Style transformers of container, loadingPlay and scenePlay.

- `nextPhaseCheckers: object` - Phase checks of container, loadingPlay and scenePlay.

## Tools API

### `bundleToComponent(bundle, extraProps)`

A helper function of transforming bundle to react component.

### `bundleToElement(bundle, props, extraProps)`

A helper function of transforming bundle to react element.

## Saga API

### `bundleToComponent(bundle, extraProps)`

### `getSceneState()` 

Get state of current scene.

**Example**

```javascript
import { setSceneState, takeLatestSceneAction } from "redux-arena/effects";

function * doSomthing({ payload }){
  yield setSceneState({ payload })
}

export function* saga (){
  yield takeLatestSceneAction("DO_SOMETHING", doSomthing)
}
```

### `getSceneActions()`

Get actions of current scene.

### `putSceneAction(action)`

Put an action of current scene.

### `setSceneState(state)`

Set state of current scene.

**Example**

```javascript
import { setSceneState, getSceneState } from "redux-arena/effects";

function * doSomthing(){
  let { a } = yield getSceneState()
  yield setSceneState({ a : a+1 })
}
```

### `takeEverySceneAction(pattern, saga, ...args)`

Take every scene action of pattern.

### `takeLatestSceneAction(pattern, saga, ..args)`

Take latest scene action of pattern.

### `takeSceneAction(pattern)`

Take scene action of pattern.