import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ArenaScene } from "redux-arena";
import AsyncLoadHOC from "../AsyncLoadHOC";
import * as actions from "./redux/actions";

import moduleReUseBundle from "../moduleReUse";
import scopedPageBundle from "../scopedPage";
import passDownBundle from "../passDownStateAndActions";

const linkStyle = {
  textDecoration: "underline",
  color: "blue",
  cursor: "pointer"
};

class Frame extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.setState({
      page: "emptyPage",
      sceneBundleThunk: () => import("../scopedPage")
    });
  }

  render() {
    let { cnt, addCnt, clearCnt } = this.props;
    return (
      <div>
        <div>
          <ul>
            <li>
              <a
                style={linkStyle}
                onClick={() => this.setState({ page: "emptyPage" })}
              >
                Empty Page
              </a>
            </li>
            <li>
              <a
                style={linkStyle}
                onClick={() => this.setState({ page: "scopedPage" })}
              >
                Scoped Page
              </a>
            </li>
            <li>
              <a
                style={linkStyle}
                onClick={() =>
                  this.setState({ page: "passDownStateAndActions" })}
              >
                Pass Down State And Actions
              </a>
            </li>
            <li>
              <a
                style={linkStyle}
                onClick={() => this.setState({ page: "moduleReUse" })}
              >
                Module Re-Use
              </a>
            </li>
            <li>
              <a
                style={linkStyle}
                onClick={() => this.setState({ page: "asyncScopedPage" })}
              >
                Async Scoped Page
              </a>
            </li>
          </ul>
          <div style={{ display: "flex" }}>
            <div style={{ marginLeft: "1rem" }}>total count: {cnt}</div>
            <button onClick={addCnt} style={{ marginLeft: "1rem" }}>
              Add Total Count
            </button>
            <button onClick={clearCnt} style={{ marginLeft: "1rem" }}>
              Clear Total Count
            </button>
          </div>
          <hr />
          <div>
            <div style={{ marginTop: "1rem" }}>
              {this.state.page === "scopedPage" ? (
                <ArenaScene sceneBundle={scopedPageBundle} />
              ) : this.state.page === "passDownStateAndActions" ? (
                <ArenaScene sceneBundle={passDownBundle} />
              ) : this.state.page === "moduleReUse" ? (
                <ArenaScene sceneBundle={moduleReUseBundle} />
              ) : this.state.page === "asyncScopedPage" ? (
                <AsyncLoadHOC sceneBundleThunk={this.state.sceneBundleThunk} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

function mapStateToProps(state) {
  return { cnt: state.frame.cnt };
}

export default connect(mapStateToProps, mapDispatchToProps)(Frame);
