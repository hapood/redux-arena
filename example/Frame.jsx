import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReduxArena from "../src/ReduxArena";
import PublicScene from "../src/PublicScene";
import PageA from "./PageA/PageA";
import PageB from "./PageB/PageB";
import pageAState from "./PageA/state";
import pageBState from "./PageB/state";
import * as actions from "./actions";

class Frame extends Component {
  render() {
    return (
      <div>
        <button onClick={() => this.props.history.push("/PageA")}>PageA</button>
        <button onClick={() => this.props.history.push("/PageB")}>PageB</button>
        <ReduxArena>
          <PublicScene
            exact
            strict
            path="/PageA"
            state={pageAState}
            SceneComponent={PageA}
          />
          <PublicScene
            exact
            strict
            path="/PageB"
            state={pageBState}
            SceneComponent={PageB}
          />
        </ReduxArena>
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
