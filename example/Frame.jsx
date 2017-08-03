import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReduxArena from "../src/ReduxArena";
import PublicScene from "../src/PublicScene";
import pageABundle from "./pageABundle";
import * as actions from "./actions";

const asyncPageB = import("./pageBBundle");
class Frame extends Component {
  render() {
    return (
      <div>
        <button onClick={() => this.props.history.push("/pageA")}>PageA</button>
        <button onClick={() => this.props.history.push("/asyncPageB")}>
          asyncPageB
        </button>
        <div style={{ marginTop: "1rem" }}>
          <ReduxArena>
            <PublicScene path="/pageA" sceneBundle={pageABundle} />
            <PublicScene path="/asyncPageB" asyncSceneBundle={asyncPageB} />
          </ReduxArena>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

function mapStateToProps(state) {
  return {
    history: state.arena.history
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Frame);
