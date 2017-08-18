import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Frame from "./frame/Frame";
import createHistory from "history/createBrowserHistory";
import configureStore from "./configureStore";

const history = createHistory();
const store = configureStore(history);
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

if (module.hot) {
  module.hot.accept("./frame/Frame", () => {
    const UpdatedFrame = require("./frame/Frame").default;
    render(
      <Provider store={store}>
        <UpdatedFrame history={history} />
      </Provider>,
      app
    );
  });
}
