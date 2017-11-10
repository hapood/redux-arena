import * as React from "react";
import { expect } from "chai";
import { spy } from "sinon";
import { StateDict, ActionsDict } from "src";
import bundleToComponent from "./bundleToComponent";
import bundleToElement from "./bundleToElement";
import { ActionCreatorsMapObject } from "redux";

class TestComponent extends React.Component<{
  a: string;
  b: string;
  actions: ActionCreatorsMapObject;
}> {
  render() {
    return <div>{this.props.a + this.props.b}</div>;
  }
}

const bundle = {
  Component: TestComponent,
  state: { a: "a" },
  propsPicker: (
    { $0: state }: StateDict<{ a: string }>,
    { $0: actions }: ActionsDict
  ) => ({
    actions,
    a: state.a
  })
};

describe("Redux-Arena tools bundle transform", () => {
  it("should referring right types", () => {
    const A = bundleToComponent(bundle);
    const B = bundleToElement(bundle, { b: "b" });
  });
});
