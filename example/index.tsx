import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Frame from "./frame/Frame";
import configureStore from "./configureStore";

let store = configureStore(history);

document.getElementById("loadingsStyle").remove();
document.getElementById("app").className = "";

let appDom = document.getElementById("app");

let render = (FrameComponent, version) => {
  let AProvider = Provider as any;
  ReactDOM.render(
    <AProvider store={store}>
      <FrameComponent version={version} />
    </AProvider>,
    appDom
  );
};

let version = 0;
render(Frame, version);
if ((module as any).hot) {
  (module as any).hot.accept("./frame/Frame", () => {
    let UpdatedFrame = require("./frame/Frame").default;
    render(UpdatedFrame, ++version);
  });
}
