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
import * as actions from "./actions";
import PageA from "./PageA";

export default bundleToComponent({
  Component: PageA,
  state,
  saga,
  actions
})
```

2. Initial arenaStore and provide it for redux. 

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createArenaStore } from "redux-arena";
import PageA from "./pageA";

const store = createArenaStore();

const app = document.getElementById("app");
ReactDOM.render(
  <Provider store={store}>
    <PageA />
  </Provider>,
  app
);
```

## HOC

Redux-arena provide a set of useful HOCs to enhance react-router.

### ArenaScene

If route is not necessary, use ArenaScene.

```javascript
<ArenaScene asyncSceneBundle={asyncPageB} />
```

### ArenaSwitch

Instead of Switch of react-router.

```javascript
<ArenaSwitch>
    <RouteScene path="/pageA" sceneBundle={pageABundle} />
    <RouteScene path="/asyncPageB" asyncSceneBundle={asyncPageB} />
</ArenaSwitch>
```

### RouteScene

An enhanced Route witch accept sceneBundle prop. Support asyncSceneBundle for code splitting. Prop exact and strict and other props defined in Route of react-router will work.

```javascript

<RouteScene path="/asyncPageB" asyncSceneBundle={asyncPageB} exact strict />

```

## Saga operations

With setSceneState and getSceneState, getting and updating bundle state easily.

```javascript
import { setSceneState, getSceneState } from "redux-arena/effects";

function * doSomthing(){
  let { a } = yield getSceneState()
  yield setSceneState({ a : a+1 })
}
```

With takeLatestSceneAction, action saga will only accept action dispatched from current bundle.

```javascript
import { setSceneState, takeLatestSceneAction } from "redux-arena/effects";

function * doSomthing({ payload }){
  yield setSceneState({ payload })
}

export function* saga (){
  yield takeLatestSceneAction("DO_SOMETHING", doSomthing)
}
```