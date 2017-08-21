# redux-arena

[![Build Status](https://travis-ci.org/hapood/redux-arena.svg?branch=master)](https://travis-ci.org/hapood/redux-arena) 
[![Coverage Status](https://coveralls.io/repos/hapood/redux-arena/badge.svg?branch=master&service=github)](https://coveralls.io/github/hapood/redux-arena?branch=master)
[![npm version](https://img.shields.io/npm/v/redux-arena.svg?style=flat-square)](https://www.npmjs.com/package/redux-arena)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)

Redux-arena is a tool for modularizing redux/redux-saga with react component. Scope redux/redux-saga within bundle, and auto clear redux/redux-saga in bundle after react component unmounted.

## Why I write this tool

Redux is a great state management container, I love redux-saga and react-router very much. But when I am developing a webapp for management console, packaging a dozen url related page-components into one entity is annoying.

Every url related page-component in management console webapp is nearly independent, but when we register its state and reducer in original redux, states and reducers will work all life-circle of redux. That's not necessary, it will cause some problems like same action type conflict, reducer inefficient, etc.

Redux-arena is designed to solve these problems once and for all, when scene changed the state, reducer, and saga will be replaced by redux-arena, looks like the two scene connected with irrelevant store.

Take this tool and build management console webapp easier with our favourite react&redux.

## Install

```
npm install redux-arena --save
```

## Example

```
cd example
npm install
npm start
```

## Quick Start

### Export your url related scene bundle

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
  mapStateToProps: function mapStateToProps(state,key) {
    return {
      pageA: state[key].pageA,
      name: state[key].name,
      dynamicState: state[key].dynamicState,
      cnt: state[key].cnt
    };
  }
};

```

### Build PublicScene HOC as a children of ReduxArena

```javascript

import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { BrowserRouter, Link } from "react-router-dom";
import { PublicScene , SceneSwitch } from "redux-arena";
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
            <SceneSwitch>
              <PublicScene path="/pageA" sceneBundle={pageABundle} />
              <PublicScene path="/asyncPageB" asyncSceneBundle={asyncPageB} />
            </SceneSwitch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

```

### Initial ehenced arenaStore and provide it for react. 

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

Redux-arena provide a set of useful HOCs to enhence react-router

### SceneSwitch

###IndependentScene

Bundle redux with react component. Reducer and saga in bundle will mount/unmount with IndependentScene.

```javascript

<PublicScene asyncSceneBundle={asyncPageB} />

```

An enhenced Switch. All PublicScene and PrivateScene should pass in as children.

```javascript

<SceneSwitch>
    <PublicScene path="/pageA" sceneBundle={pageABundle} />
    <PrivateScene path="/asyncPageB" asyncSceneBundle={asyncPageB} />
</SceneSwitch>

```

### PublicScene

An enhenced Route witch accept sceneBundle prop. Support asyncSceneBundle for code splitting. Prop exact and strict and other props defined in Route of react-router will work.

```javascript

<PublicScene path="/asyncPageB" asyncSceneBundle={asyncPageB} exact strict />

```

### PrivateScene

An enhenced PublicScene whitch accept onValidate onPass and onReject props. Helpful when integrating with access control system.

```javascript

<PrivateScene path="/asyncPageB" 
    sceneBundle={pageA}
    onValidate={(cb,match,location,type)=>cb(true)}
    onPass={(data)=>console.debug("pass")}
    onReject={(data)=>this.props.jumpTo("/login")}
/>

```

### RedirectScene

An simple redirect url to prop to anther when prop from is matched.

```javascript
<RedirectScene from="/pageA" to="/pageA/first" />
```

## Action types

A set of action types defined in redux/actionTypes. Some action types is helpful to change state of scene or arena, and some helpful for knowing the current status of redux-arena better.

### SCENE_SET_STATE

Redux-arena will subscribe this action type and merge state into current scene state.

In Action:

```javascript
import { SCENE_SET_STATE } from "redux-arena/redux/actionTypes";

function doSomthing(){
  return { 
    type: SCENE_SET_STATE,
    state: { a:1 }
  }
}
```

In saga:

```javascript
import { setSceneState } from "redux-arena/sagaOps";

function * doSomthing(){
  yield* setSceneState({a:1})
}
```

### SCENE_LOAD_START SCENE_LOAD_END

Redux-arena will dispatch these action types when scene bundle loading start and bundle loading end. Subscribe these in your saga to show or hide something like spin.

```javascript

yield takeLatest(SCENE_LOAD_START, startLoadingBar)
yield takeLatest(SCENE_LOAD_END, stopLoadingBar)

```