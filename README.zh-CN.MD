# redux-arena

[![Build Status](https://travis-ci.org/hapood/redux-arena.svg?branch=master)](https://travis-ci.org/hapood/redux-arena) 
[![Coverage Status](https://coveralls.io/repos/hapood/redux-arena/badge.svg?branch=master&service=github)](https://coveralls.io/github/hapood/redux-arena?branch=master)
[![npm version](https://img.shields.io/npm/v/redux-arena.svg?style=flat-square)](https://www.npmjs.com/package/redux-arena)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)

对于redux-arena，你可以简单的理解为它是一个为redux增加了模块化功能的增强版，不同于一般意义上的redux中间件，它一定程度上改变了redux的行为。当前版本的redux初始化过程是与react组件独立的，而redux-arena会将action/reducer/saga与react组件绑定在一起加载，在react组件的生命周期结束时，对应于这个组件的redux信息将会被自动清理掉。

## 为什么选择redux-arena

在很多基于react的大型企业Web项目开发中，redux/redux-saga/react-router已经成为开发的不可获缺的一部分。但是在使用过程中，将这一切整合到一起颇为麻烦，虽然社区提供丰富的文档和很多问题解决案例，但是当项目变得越来越复杂时，需要一个框架将这一切管理起来。

主要问题之一，就是基于url的页面的状态彼此相互独立，在同一时刻用户访问的url是唯一的。虽然react会帮助我们自动加载和卸载组件，但是由于redux生命周期与react独立，在页面被卸载后其reducer和saga依然处于激活状态，造成不必要的性能开销。

使用redux-arena可以完美的解决这个问题，当react-router切换页面时，redux-arena会自动渲染新的react组件并初始化组件相关的state/actions/reducer/saga，同时所有上个页面的redux信息都会被自动清理。

这个工具目前仍在持续开发中，欢迎任何issue以及pr。

## 安装

```
npm install redux-arena --save
```

## [示例](https://hapood.github.io/redux-arena/)

`/example`目录下包含了一个完整的示例，包括了多个HOC的使用。并且使用了redux-devtool动态展示state的变化。
在线版本的示例点击[这里](https://hapood.github.io/redux-arena/)

### Screenshots
<img src="https://raw.githubusercontent.com/hapood/redux-arena/d6c324d44636d19e7c2b824d295620053c73b1f6/redux-arena-demo.gif" width="800"/>

## 快速入门

### 将react组件、actions、reducer、saga、mapStateToProps打包导出

redux-arena扩展了mapStateToProps函数的传入参数，reducerKey是当前模块初始化时由redux-arena自动分配的，通过reducerKey可以获取到当前bundle的state。

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

### 使用ArenaSwitch和RouteScene替代react-router中的Switch和Route

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

### 初始化arenaStore并将其提供给redux

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

Redux-arena提供了一组可以和react-router整合使用的高阶组件。

###SoloScene

如果你不需要路由功能，直接使用SoloScene。


```javascript
<SoloScene asyncSceneBundle={asyncPageB} />
```

### ArenaSwitch

替代react-router的Switch组件。

```javascript
<ArenaSwitch>
    <RouteScene path="/pageA" sceneBundle={pageABundle} />
    <PrivateRouteScene path="/asyncPageB" asyncSceneBundle={asyncPageB} />
</ArenaSwitch>
```

### RouteScene

扩展了react-router中route的props，sceneBundle用来接收同步模块，如果模块使用import()做了代码分割，需要将异步模块传入asyncPageB。

```javascript
<RouteScene path="/asyncPageB" asyncSceneBundle={asyncPageB} exact strict />
```

### PrivateRouteScene

帮助构造需要验证登录功能的页面。相对RouteScene增加了onValidate、onPass、onReject三个回调函数。

```javascript
<PrivateRouteScene path="/asyncPageB" 
    sceneBundle={pageA}
    onValidate={(cb,match,location,type)=>cb(true)}
    onPass={(data)=>console.debug("pass")}
    onReject={(data)=>this.props.jumpTo("/login")}
/>
```

## reducer

redux-arena对redux的reducer进行了扩展，增加了当前模块reducerKey作为传入参数，
与action中的_sceneKey作比较判断来源，决定是否执行更新。

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

如果希望reducer只接收本模块发出的reducer请求，可以使用sceneReducer函数。

```javascript
import { sceneReducer } from "redux-arena/sceneScope";

function reducer(state = initState, action, reducerKey){
  //...
}

export default sceneReducer(reducer)
```

## Saga操作

使用getSceneState和setSceneState获取和更新当前模块的state

```javascript
import { setSceneState, getSceneState } from "redux-arena/sagaOps";

function * doSomthing(){
  let { a } = yield* getSceneState()
  yield* setSceneState({ a:a+1 })
}
```

使用sceneActionSaga来使saga只接收来自本模块的action。

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