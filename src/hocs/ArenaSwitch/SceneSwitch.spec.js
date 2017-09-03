/* eslint-env mocha */
import React from "react";
import { shallow } from "enzyme";
import { expect, assert } from "chai";
import sinon from "sinon";
import ArenaSwitch from "./ArenaSwitch";

describe("<ArenaSwitch />", () => {
  it("should add reducer and render Switch", () => {
    const addReducerSpy = sinon.spy();
    const dispatchSpy = sinon.spy();
    const ctx = {
      store: {
        addReducer: addReducerSpy,
        dispatch: dispatchSpy
      }
    };
    const wrapper = shallow(<ArenaSwitch />, { context: ctx });
    expect(addReducerSpy).to.have.property("callCount", 1);
    expect(dispatchSpy).to.have.property("callCount", 1);
  });
});
