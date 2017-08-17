import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createArenaStore } from "../src";
import Frame from "./frame/Frame";
import thunk from "redux-thunk";
import createHistory from "history/createBrowserHistory";
import reducer from "./frame/redux/reducer";
import saga from "./frame/redux/saga";

const history = createHistory();
const store = createArenaStore(
  { frame: reducer },
  { frame: { history } },
  saga,
  [thunk]
);

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
