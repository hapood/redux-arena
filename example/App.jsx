import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createArenaStore } from "../src";
import Frame from "./Frame";
import thunk from "redux-thunk";
import createHistory from "history/createBrowserHistory";

const history = createHistory();
const store = createArenaStore(null, null, null, [thunk]);
store.setHistory(history);

const app = document.getElementById("app");
ReactDOM.render(
  <Provider store={store}>
    <Frame history={history} />
  </Provider>,
  app,
  function() {
    document.getElementById("app").className = "";
  }
);
