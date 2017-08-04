# redux-arena

[![Build Status](https://travis-ci.org/hapood/redux-arena.svg?branch=master)](https://travis-ci.org/hapood/redux-arena) 
[![Coverage Status](https://coveralls.io/repos/hapood/redux-arena/badge.svg?branch=master&service=github)](https://coveralls.io/github/hapood/redux-arena?branch=master)
[![npm version](https://img.shields.io/npm/v/redux-arena.svg?style=flat-square)](https://www.npmjs.com/package/redux-arena)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)

Redux Arena. Auto switch context of redux refer to url. Side effect isolated between different url.

## Why I write this tool

Redux is a great state management container, I love redux-saga and react-router very much. But when I am developing a webapp for management console, packaging a dozen url related page-components into one entity is annoying.

Every url related page-component in management console webapp is nearly independent, but when we register its state and reducer in original redux, states and reducers will work all life-circle of redux. That's not necessary, it will cause some problems like same action type conflict, reducer inefficient, etc.

Redux arena is designed to solve these problems once and for all, when scence changed the state, reducer, and saga will be replaced by arena, looks like the two scene connected with irrelevant store.

Take this tool and build management console webapp easier with our favourite Redux&Redux.

## Install

```
npm install redux-arena --save
```

## Example

```
npm install
npm run example
```