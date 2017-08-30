import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Frame from "./frame/Frame";
import createHistory from "history/createBrowserHistory";
import configureStore from "./configureStore";

const history = createHistory();
const store = configureStore(history);

let appDom = document.getElementById("app");

const render = FrameComponent => {
  ReactDOM.render(
    <Provider store={store}>
      <FrameComponent history={history} />
    </Provider>,
    appDom,
    function() {
      document.getElementById("app").className = "";
    }
  );
};

render(Frame);

if (module.hot) {
  module.hot.accept("./frame/Frame", () => {
    const UpdatedFrame = require("./frame/Frame").default;
    render(UpdatedFrame);
  });
}
