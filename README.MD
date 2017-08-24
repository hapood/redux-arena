# redux-arena

[![Build Status](https://travis-ci.org/hapood/redux-arena.svg?branch=master)](https://travis-ci.org/hapood/redux-arena) 
[![Coverage Status](https://coveralls.io/repos/hapood/redux-arena/badge.svg?branch=master&service=github)](https://coveralls.io/github/hapood/redux-arena?branch=master)
[![npm version](https://img.shields.io/npm/v/redux-arena.svg?style=flat-square)](https://www.npmjs.com/package/redux-arena)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)

Redux-arena is a tool for modularizing redux/redux-saga with react component. Scope redux/redux-saga within bundle, and auto clear redux/redux-saga in bundle after react component unmounted.

## Why redux-arena

Redux is a great state management container, I love redux-saga and react-router very much. But when I am developing a webapp for management console, packaging a dozen url related page-components into one entity is annoying.

Every url related page-component in management console webapp is nearly independent, but when we register its state and reducer in original redux, states and reducers will work all life-circle of redux. That's not necessary, it will cause some problems like same action type conflict, reducer inefficient, etc.

Redux-arena is designed to solve these problems once and for all, when scene changed, the state, actions, reducer, and saga will be replaced by redux-arena, looks like the two scene connected with irrelevant store.

And any issue or pr is welcomed.

## Install

```
npm install redux-arena --save
```

## [Example](https://hapood.github.io/redux-arena/)

An complete example is under `/example` directory, including a lot of HOC. And add redux-devtools for state changing show.
Online example can be found here: [Here](https://hapood.github.io/redux-arena/)

### Screenshots
<img src="https://raw.githubusercontent.com/hapood/redux-arena/d6c324d44636d19e7c2b824d295620053c73b1f6/redux-arena-demo.gif" width="800"/>

## Quick Start

1. Bundle react component, actions, reducer, saga, mapStateToProps and export.

redux-arena extends original mapStateToProps, reducerKey is created by redux-arena and referring to current bundle state.

```javascript
import state from "./state";
import saga from "./saga";
import reducer from "./reducer";
import * as actions from "./actions";
import PageA from "./PageA";

export default {
  Component: PageA,
  state,
  saga,
  reducer,
  actions,
  mapStateToProps: function mapStateToProps(state, reducerKey) {
    return {
      pageA: state[reducerKey].pageA,
      name: state[reducerKey].name,
      dynamicState: state[reducerKey].dynamicState,
      cnt: state[reducerKey].cnt
    };
  }
};
```

2. Replace Switch/Route of react-router with ArenaSwitch/RouteScene

```javascript
import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { BrowserRouter, Link } from "react-router-dom";
import { RouteScene , ArenaSwitch } from "redux-arena";
import pageABundle from "./pageABundle";
import * as actions from "./actions";

const asyncPageB = import("./pageBBundle");
eport default class Frame extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/pageA">pageA</Link>
          </li>
          <li>
            <Link to="/asyncPageB">asyncPageB</Link>
          </li>
        </ul>
        <div style={{ marginTop: "1rem" }}>
          <BrowserRouter>
            <ArenaSwitch>
              <RouteScene path="/pageA" sceneBundle={pageABundle} />
              <RouteScene path="/asyncPageB" asyncSceneBundle={asyncPageB} />
            </ArenaSwitch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}
```

3. Initial arenaStore and provide it for redux. 

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createArenaStore } from "redux-arena";
import Frame from "./Frame";
import thunk from "redux-thunk";

const store = createArenaStore();

const app = document.getElementById("app");
ReactDOM.render(
  <Provider store={store}>
    <Frame />
  </Provider>,
  app,
  function() {
    document.getElementById("app").className = "";
  }
);
```

## HOC

Redux-arena provide a set of useful HOCs to enhence react-router.

###SoloScene

If route is not necessary, use SoloScene.

```javascript
<SoloScene asyncSceneBundle={asyncPageB} />
```

### ArenaSwitch

Instead of Switch of react-router.

```javascript
<ArenaSwitch>
    <RouteScene path="/pageA" sceneBundle={pageABundle} />
    <PrivateRouteScene path="/asyncPageB" asyncSceneBundle={asyncPageB} />
</ArenaSwitch>
```

### RouteScene

An enhenced Route witch accept sceneBundle prop. Support asyncSceneBundle for code splitting. Prop exact and strict and other props defined in Route of react-router will work.

```javascript

<RouteScene path="/asyncPageB" asyncSceneBundle={asyncPageB} exact strict />

```

### PrivateRouteScene

An enhenced RouteScene whitch accept onValidate onPass and onReject props. Helpful when integrating with access control system.

```javascript

<PrivateRouteScene path="/asyncPageB" 
    sceneBundle={pageA}
    onValidate={(cb,match,location,type)=>cb(true)}
    onPass={(data)=>console.debug("pass")}
    onReject={(data)=>this.props.jumpTo("/login")}
/>

```

## Reducer

redux-arena extends reducer of redux, add incoming reducerKey, comparing to _sceneKey of action and decide updating or not.

```javascript
// original reducer
function reducer(state = initState, action){
  //...
}

// extended reducer
function reducer(state = initState, action, reducerKey){
  //...
}
```

With sceneReducer, reducer will only accept action dispatched from current bundle.

```javascript
import { sceneReducer } from "redux-arena/sceneScope";

function reducer(state = initState, action, reducerKey){
  //...
}

export default sceneReducer(reducer)
```

## Saga operations

With setSceneState and getSceneState, getting and updating bundle state easily.

```javascript
import { setSceneState, getSceneState } from "redux-arena/sagaOps";

function * doSomthing(){
  let { a } = yield* getSceneState()
  yield* setSceneState({ a:a+1 })
}
```

With sceneActionSaga, action saga will only accept action dispatched from current bundle.

```javascript
import { sceneActionSaga } from "redux-arena/sceneScope";
import { setSceneState } from "redux-arena/sagaOps";

function * doSomthing({ payload }){
  yield* setSceneState({ payload })
}

export function* saga (){
  yield takeLatest("DO_SOMETHING",sceneActionSaga(doSomthing))
}
```