import React, { Component } from "react"
import PropTypes from "prop-types"
import { ArenaSceneLoadMotion } from "redux-arena"
import { bundleToElement } from "redux-arena/tools"
import LoadingPage from "./LoadingPage"
import * as sceneAnimation from "./sceneAnimation"

export default class AsyncLoadHOC extends Component {
    static propTypes = {
        asyncBundleThunk: PropTypes.func.isRequired
    }
    render() {
        return (
            <ArenaSceneLoadMotion
                asyncBundleThunk={this.props.asyncBundleThunk}
                loadingPlay={<LoadingPage />}
                initStyles={sceneAnimation.initStyles}
                styleCalculators={sceneAnimation.styleCalculators}
                numberToStyle={sceneAnimation.numberToStyle}
                nextPhaseCheckers={sceneAnimation.nextPhaseCheckers}
            >
                {bundle => bundleToElement(bundle)}
            </ArenaSceneLoadMotion>
        )
    }
}
