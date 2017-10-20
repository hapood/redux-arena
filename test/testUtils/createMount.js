import { unmountComponentAtNode } from "react-dom"
import { configure } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
configure({ adapter: new Adapter() })

import { mount } from "enzyme"

// Generate an enhanced mount function.
export default function createMount() {
    let attachTo = window.document.createElement("div")
    attachTo.setAttribute("id", "app")
    window.document.body.insertBefore(attachTo, window.document.body.firstChild)

    let mountWithContext = function mountWithContext(node, mountOptions = {}) {
        return mount(node, {
            attachTo,
            ...mountOptions
        })
    }

    mountWithContext.attachTo = attachTo
    mountWithContext.cleanUp = () => {
        unmountComponentAtNode(attachTo)
        attachTo.parentNode.removeChild(attachTo)
    }

    return mountWithContext
}
