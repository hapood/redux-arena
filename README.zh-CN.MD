# redux-arena

[![Build Status](https://travis-ci.org/hapood/redux-arena.svg?branch=master)](https://travis-ci.org/hapood/redux-arena) 
[![Coverage Status](https://coveralls.io/repos/github/hapood/redux-arena/badge.svg?branch=master)](https://coveralls.io/github/hapood/redux-arena?branch=master)
[![npm version](https://img.shields.io/npm/v/redux-arena.svg?style=flat-square)](https://www.npmjs.com/package/redux-arena)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)

Redux毫无疑问是一个模型简洁漂亮，扩展性极佳的状态管理器，但是在其与React整合使用时，我们有时会希望React能与Redux的代码整合起来形成一个可复用的复杂组件，具体的描述可以参见 [RFC: Reuse complex components implemented in React plus Redux #278](https://github.com/reactjs/react-redux/issues/278), Redux-Arena就是一个为解决这个问题开发的Redux模块化管理器。


## 功能特性

Redux-Arena会将Redux/Redux-Saga的代码与React组件导出成一个React高阶组件以供复用：
1. 在高阶组件被挂载（Mount）时，会自动初始化Redux-Saga的任务，初始化组件的reducer并在Redux维护的State上注册自己的节点。
2. 在高阶组件被卸载（Unmout）时，会自动取消Redux-Saga的任务，销毁组件的reducer并从Redux维护的State上删除自己的节点。
3. 提供组件信道机制，组件发送的Action默认只能被组件自己的reducer接收。也可以通过配置放弃信道，接收全局的action。
4. 提供vReducerKey机制，Redux中如果组件间想共享state信息，需要知道知道真实的节点名称，在可复用的Redux组件中很容易引发冲突，Redux-Arena提供vReducerKey机制保证了state节点真实名称永远不会冲突。vReducerKey在同名时，下层组件会覆盖掉上层组件的vReducerKey信息。
5. 提供单向的（类似flux的 one-way data flow）组件状态和actions的共享方案，下层组件可以通过vReducerKey获取上层组件的state和actions。
6. 与Redux-Saga深度整合，在Redux-Saga中也可以选择只发送和接收组件自己的action。

此外，Redux-Arena还提供了与React-Router的整合方案。

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

1. 将react组件、actions、reducer、saga 文件导出成React组件

```javascript
import { bundleToComponent } from "redux-arena/tools";
import state from "./state";
import * as actions from "./actions";
import PageA from "./PageA";

export default bundleToComponent({
  Component: PageA,
  state,
  actions
})
```

2. 初始化arenaStore并将其提供给redux

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

## 高阶组件介绍

Redux-arena提供了一组可以和react-router整合使用的高阶组件。

### ArenaScene

如果你不需要路由功能，直接使用SoloScene。


```javascript
<ArenaScene asyncSceneBundle={asyncPageB} />
```

### ArenaSwitch

替代react-router的Switch组件。

```javascript
<ArenaSwitch>
    <RouteScene path="/pageA" sceneBundle={pageABundle} />
    <RouteScene path="/asyncPageB" asyncSceneBundle={asyncPageB} />
</ArenaSwitch>
```

### RouteScene

扩展了react-router中route的props，sceneBundle用来接收同步模块，如果模块使用import()做了代码分割，需要将异步模块传入asyncPageB。

```javascript
<RouteScene path="/asyncPageB" asyncSceneBundle={asyncPageB} exact strict />
```

## Saga操作

使用getSceneState和setSceneState获取和更新当前模块的state

```javascript
import { setSceneState, getSceneState } from "redux-arena/effects";

function * doSomthing(){
  let { a } = yield getSceneState()
  yield setSceneState({ a : a+1 })
}
```

使用sceneActionSaga接收来自本模块的action。

```javascript
import { setSceneState, takeLatestSceneAction } from "redux-arena/effects";

function * doSomthing({ payload }){
  yield setSceneState({ payload })
}

export function* saga (){
  yield takeLatestSceneAction("DO_SOMETHING", doSomthing)
}
```