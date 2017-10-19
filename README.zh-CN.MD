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

2. 初始化arenaStore并将其提供给redux。PageA组件是上一步导出的。

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
  * [`asyncBundleToComponent(asyncBundle, extraProps)`](#bundletoelementbundle-props-extraProps)
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

为redux-arena创建增强版store

- `reducers: object` - 对象形式的redux的reducer。

   **Example**
   
     ```javascript
     {
       frame: (state)=>state,
       page: (state)=>state,
       ...
     }
     ```

- `initialStates: object` - 对象形式的redux的state。

   **Example**

    ```javascript
     {
       frame: { location:"/" },
       page: { cnt:0 },
       ...
     }
    ```


- `enhencers: array` - 数组形式的redux enhencers。

    **Example**

    ```javascript
    import { applyMiddleware } from "redux";
    import thunk from "redux-thunk";

    let enhancers = [applyMiddleware(thunk)];
    ```

- `sagaOptions：object` - redux-saga的扩展选项。

- `enhancedStore：object` - 函数返回值，拥有以下方法：

  - `runSaga(saga)` -  开始一个saga任务.


## Bundle API

Bundle是一个包含react-component, actions, reducer, saga ，options的对象, 用于ArenaScene高阶组件。

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

- `Component: React.Component` - 用于绑定Redux的React组件。

- `state: object` - Bundle的初始状态。

- `actions: object` - 与Redux的actions相同，当组件被挂载时初始化。

- `saga: function*` - Redux-Saga的生成器函数，当组件被挂载时初始化。

- `options: object` - Bundle的选项。

  - `reducerKey: string` - 为bundle指定reducerKey。

  - `vReducerKey: string` - 为bundle指定虚拟reducerKey。

  - `isSceneAction: bool` - 如果为false, "_sceneReducerKey"不会添加到发送的action中。

  - `isSceneReducer: bool` - 如果为false, reducer会接收其他bundle发送的action。

## HOC API

### `<ArenaScene />`

将bundle转换为react element的容器，props如下所示：

- `sceneBundle: object` - 需要加载的同步bundle。

- `sceneProps: object` - Bundle组件接收的props。

- `reducerKey: string` - 为容器指定reducerKey。

- `vReducerKey: string` - 为容器指定虚拟reducerKey。

### `<ArenaSceneMotion />`

ArenaScene的加载动画框架，props如下所示：

- `children: element` - ArenaScene渲染出的element。

- `asyncBundleThunk: () => Promise` - 用于异步加载bundle的函数。

- `loadingPlay: element` - 加载动画的element。

- `initStyles: object` - Container、loadingPlay、scenePlay的初始化样式。

- `styleCalculators: object` - Container、loadingPlay、scenePlay的样式计算函数。

- `numberToStyle: object` - Container、loadingPlay、scenePlay的样式转换函数。

- `nextPhaseCheckers: object` - Container、loadingPlay、scenePlay的阶段检查器。

## Tools API

### `bundleToComponent(bundle, extraProps)`

将Bundle转化为组件的帮手函数。

### `bundleToElement(bundle, props, extraProps)`

将Bundle转化为element的帮手函数。

## Saga API

### `bundleToComponent(bundle, extraProps)`

### `getSceneState()` 

获取当前scene的state。

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

获取当前scene的state。

### `putSceneAction(action)`

发送当前scene的action。

### `setSceneState(state)`

设置当前scene的state。

**Example**

```javascript
import { setSceneState, getSceneState } from "redux-arena/effects";

function * doSomthing(){
  let { a } = yield getSceneState()
  yield setSceneState({ a : a+1 })
}
```

### `takeEverySceneAction(pattern, saga, ...args)`

获取当前scene的每一个action

### `takeLatestSceneAction(pattern, saga, ..args)`

获取当前scene的最新action

### `takeSceneAction(pattern)`

获取当前scene的action