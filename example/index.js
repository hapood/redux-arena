import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Frame from "./frame/Frame";
import createHistory from "history/createBrowserHistory";
import configureStore from "./configureStore";

const history = createHistory();
const store = configureStore(history);

document.getElementById("loadingsStyle").remove();
document.getElementById("app").className = "";

let appDom = document.getElementById("app");

const render = (FrameComponent, version) => {
  ReactDOM.render(
    <Provider store={store}>
      <FrameComponent history={history} version={version} />
    </Provider>,
    appDom
  );
};

let version = 0;
render(Frame, version);
if (module.hot) {
  module.hot.accept("./frame/Frame", () => {
    const UpdatedFrame = require("./frame/Frame").default;
    render(UpdatedFrame, ++version);
  });
}
