import { ReactElement } from "react";
import { unmountComponentAtNode } from "react-dom";
import { configure } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

import { mount } from "enzyme";

// Generate an enhanced mount function.
export default function createMount() {
  let attachTo = window.document.createElement("div");
  attachTo.setAttribute("id", "app");
  window.document.body.insertBefore(attachTo, window.document.body.firstChild);

  let mountWithContext: any = function(
    node: ReactElement<{}>,
    mountOptions = {}
  ) {
    return mount(node, {
      attachTo,
      ...mountOptions
    });
  };
  return [
    mountWithContext,
    () => {
      unmountComponentAtNode(attachTo);
      attachTo.parentNode && attachTo.parentNode.removeChild(attachTo);
    }
  ];
}
