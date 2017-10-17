import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Frame from "./frame/Frame";
import configureStore from "./configureStore";

let store = configureStore(history);

document.getElementById("loadingsStyle").remove();
document.getElementById("app").className = "";

let appDom = document.getElementById("app");

let render = (FrameComponent, version) => {
  ReactDOM.render(
    <Provider store={store}>
      <FrameComponent version={version} />
    </Provider>,
    appDom
  );
};

let version = 0;
render(Frame, version);
if (module.hot) {
  module.hot.accept("./frame/Frame", () => {
    let UpdatedFrame = require("./frame/Frame").default;
    render(UpdatedFrame, ++version);
  });
}
