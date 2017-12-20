import * as React from "react";
import { expect } from "chai";
import { spy } from "sinon";
import { StateDict, ActionsDict } from "src";
import { DefaultSceneActions } from "src/core/types";
import bundleToComponent from "./bundleToComponent";
import bundleToElement from "./bundleToElement";
import { ActionsProps } from "./types";

class TestComponent extends React.Component<
  {
    a: string;
    b: string;
  } & ActionsProps<DefaultSceneActions<{ a: string }>>
> {
  render() {
    return <div>{this.props.a + this.props.b}</div>;
  }
}

const bundleWithDefaultA = {
  Component: TestComponent,
  state: { a: "a" },
  propsPicker: (
    { $0: state }: StateDict<{ a: string }>,
    { $0: actions }: ActionsDict<DefaultSceneActions<{ a: string }>>
  ) => ({
    actions,
    a: state.a
  })
};

const bundleWithDefaultAPP = {
  Component: TestComponent,
  state: { a: "a" }
};

class TestComponent2 extends React.Component<
  {
    a: string;
    b: string;
  } & { actions: { addCnt: () => void } }
> {
  render() {
    return <div>{this.props.a + this.props.b}</div>;
  }
}

const bundleWithDefaultSPP = {
  Component: TestComponent,
  actions: { addCnt: () => null }
};

const bundleWithDefaultSAPP = {
  Component: TestComponent
};

describe("Redux-Arena tools bundle transform", () => {
  it("should referring right types", () => {
    let A = bundleToComponent(bundleWithDefaultA);
    <A b="b" />;
    bundleToElement(bundleWithDefaultA, { b: "b" });
    let APP = bundleToComponent(bundleWithDefaultAPP);
    <APP b="b" />;
    bundleToElement(bundleWithDefaultAPP, { b: "b" });
    let SPP = bundleToComponent(bundleWithDefaultSPP);
    <SPP a="a" b="b" />;
    bundleToElement(bundleWithDefaultSPP, { a: "a", b: "b" });
    let SAPP = bundleToComponent(bundleWithDefaultSAPP);
    <SAPP a="a" b="b" />;
    bundleToElement(bundleWithDefaultSAPP, { a: "a", b: "b" });
  });
});
