import React, { Component } from "react"
import PropTypes from "prop-types"
import { Provider } from "react-redux"
import { ArenaSceneLoadMotion } from "src"
import { bundleToElement } from "src/tools"
import * as sceneAnimation from "./sceneAnimation"

export default class TestHOC extends Component {
    static propTypes = {
        store: PropTypes.any.isRequired,
        asyncBundleThunk: PropTypes.func.isRequired
    }
    render() {
        let props = this.props
        return (
            <Provider store={props.store}>
                <ArenaSceneLoadMotion
                    asyncBundleThunk={this.props.asyncBundleThunk}
                    loadingPlay={<div />}
                    initStyles={sceneAnimation.initStyles}
                    styleCalculators={sceneAnimation.styleCalculators}
                    numberToStyle={sceneAnimation.numberToStyle}
                    nextPhaseCheckers={sceneAnimation.nextPhaseCheckers}
                >
                    {bundle =>
                        bundleToElement(
                            Object.assign({}, bundle, {
                                options: { reducerKey: "bundle" }
                            })
                        )}
                </ArenaSceneLoadMotion>
            </Provider>
        )
    }
}
