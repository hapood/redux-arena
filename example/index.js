import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Frame from "./frame/Frame";
import createHistory from "history/createBrowserHistory";
import configureStore from "./configureStore";

const history = createHistory();
const store = configureStore(history);

let appDom = document.getElementById("app");

const render = (FrameComponent, frameVersion) => {
  console.log(frameVersion)
  ReactDOM.render(
    <Provider store={store}>
      <FrameComponent history={history} version={frameVersion} />
    </Provider>,
    appDom,
    function() {
      document.getElementById("app").className = "";
    }
  );
};

let frameVersion = 0;
render(Frame, frameVersion);

if (module.hot) {
  module.hot.accept("./frame/Frame", () => {
    const UpdatedFrame = require("./frame/Frame").default;
    render(UpdatedFrame, ++frameVersion);
  });
}
