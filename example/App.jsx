import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createArenaStore } from "../src";
import Frame from "./Frame";
import thunk from "redux-thunk";

const store = createArenaStore(null, null, null, [thunk]);

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
