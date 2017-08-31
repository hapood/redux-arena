webpackJsonp([0],{"./passDownStateAndActions/Parent.jsx":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n("./node_modules/react/react.js"),c=r(u),d=n("../src/index.js"),i=n("./passDownStateAndActions/child/index.js"),_=r(i),f=function(e){function t(){return a(this,t),s(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return o(t,e),l(t,[{key:"render",value:function(){var e=this.props.state;return c.default.createElement("div",{style:{padding:"1rem"}},c.default.createElement("table",{style:{width:"20rem"}},c.default.createElement("tbody",null,c.default.createElement("tr",null,c.default.createElement("th",null,"state_key"),c.default.createElement("th",null,"state_value")),c.default.createElement("tr",null,c.default.createElement("td",null,"name:"),c.default.createElement("td",null,e.name)),c.default.createElement("tr",null,c.default.createElement("td",null,"cnt:"),c.default.createElement("td",null,e.cnt)))),c.default.createElement(d.SoloScene,{sceneBundle:_.default}))}}]),t}(u.Component),p=f;t.default=p;!function(){"undefined"!=typeof __REACT_HOT_LOADER__&&(__REACT_HOT_LOADER__.register(f,"Parent","D:/Projects/redux-arena/example/passDownStateAndActions/Parent.jsx"),__REACT_HOT_LOADER__.register(p,"default","D:/Projects/redux-arena/example/passDownStateAndActions/Parent.jsx"))}()},"./passDownStateAndActions/actions.js":function(e,t,n){"use strict";function r(){return{type:"ADD_CNT"}}function a(){return{type:s.ARENA_SCENE_SET_STATE,state:{cnt:0}}}Object.defineProperty(t,"__esModule",{value:!0}),t.addCnt=r,t.clearCnt=a;var s=n("../src/actionTypes/index.js");!function(){"undefined"!=typeof __REACT_HOT_LOADER__&&(__REACT_HOT_LOADER__.register(r,"addCnt","D:/Projects/redux-arena/example/passDownStateAndActions/actions.js"),__REACT_HOT_LOADER__.register(a,"clearCnt","D:/Projects/redux-arena/example/passDownStateAndActions/actions.js"))}()},"./passDownStateAndActions/child/Child.jsx":function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n("./node_modules/react/react.js"),u=function(e){return e&&e.__esModule?e:{default:e}}(l),c=function(e){function t(){return r(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return s(t,e),o(t,[{key:"render",value:function(){var e=this.props,t=e.state,n=e.parentState,r=e.actions,a=e.parentActions;return u.default.createElement("div",{style:{marginTop:"1rem",border:"solid #000 1px",padding:"1rem",width:"20rem"}},u.default.createElement("span",{style:{lineHeight:"1.5rem"}},"Map parent's state to props parentState by vReducerKey"," ",u.default.createElement("span",{style:{color:"orange"}},'"parent"'),"."),u.default.createElement("table",{style:{width:"100%",marginTop:"1rem"}},u.default.createElement("tbody",null,u.default.createElement("tr",null,u.default.createElement("th",null,"state_key"),u.default.createElement("th",null,"state_value")),u.default.createElement("tr",null,u.default.createElement("td",null,"name:"),u.default.createElement("td",null,t.name)),u.default.createElement("tr",null,u.default.createElement("td",null,"parentState:"),u.default.createElement("td",null,u.default.createElement("span",null,JSON.stringify(n)))),u.default.createElement("tr",null,u.default.createElement("td",null,"cnt:"),u.default.createElement("td",null,t.cnt)))),u.default.createElement("div",{style:{marginTop:"1rem",border:"solid #000 1px",padding:"1rem"}},u.default.createElement("span",{style:{lineHeight:"1.5rem"}},"Map parent's actions to props parentActions by vReducerKey"," ",u.default.createElement("span",{style:{color:"orange"}},'"parent"'),"."),u.default.createElement("div",{style:{marginTop:"1rem"}},u.default.createElement("button",{onClick:r.addCnt},"Add Count"),u.default.createElement("button",{style:{marginLeft:"1rem"},onClick:r.clearCnt},"Clear count")),u.default.createElement("div",{style:{marginTop:"1rem"}},u.default.createElement("button",{onClick:a.addCnt},"Parent's Add Count"),u.default.createElement("button",{style:{marginLeft:"1rem"},onClick:a.clearCnt},"Parent's Clear count"))))}}]),t}(l.Component),d=c;t.default=d;!function(){"undefined"!=typeof __REACT_HOT_LOADER__&&(__REACT_HOT_LOADER__.register(c,"Child","D:/Projects/redux-arena/example/passDownStateAndActions/child/Child.jsx"),__REACT_HOT_LOADER__.register(d,"default","D:/Projects/redux-arena/example/passDownStateAndActions/child/Child.jsx"))}()},"./passDownStateAndActions/child/actions.js":function(e,t,n){"use strict";function r(){return{type:"ADD_CNT"}}function a(){return{type:s.ARENA_SCENE_SET_STATE,state:{cnt:0}}}Object.defineProperty(t,"__esModule",{value:!0}),t.addCnt=r,t.clearCnt=a;var s=n("../src/actionTypes/index.js");!function(){"undefined"!=typeof __REACT_HOT_LOADER__&&(__REACT_HOT_LOADER__.register(r,"addCnt","D:/Projects/redux-arena/example/passDownStateAndActions/child/actions.js"),__REACT_HOT_LOADER__.register(a,"clearCnt","D:/Projects/redux-arena/example/passDownStateAndActions/child/actions.js"))}()},"./passDownStateAndActions/child/index.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=n("./passDownStateAndActions/child/state.js"),s=r(a),o=n("./passDownStateAndActions/child/reducer.js"),l=r(o),u=n("./passDownStateAndActions/child/Child.jsx"),c=r(u),d=n("./passDownStateAndActions/child/actions.js"),i=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(d),_={Component:c.default,state:s.default,actions:i,reducer:l.default,mapStateToProps:function(e,t){var n=t.parent;return{parentState:e[n.reducerKey],parentActions:n.actions}}};t.default=_;!function(){"undefined"!=typeof __REACT_HOT_LOADER__&&__REACT_HOT_LOADER__.register(_,"default","D:/Projects/redux-arena/example/passDownStateAndActions/child/index.js")}()},"./passDownStateAndActions/child/reducer.js":function(e,t,n){"use strict";function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s.default;switch(arguments[1].type){case"ADD_CNT":return Object.assign({},e,{cnt:e.cnt+1});default:return e}}Object.defineProperty(t,"__esModule",{value:!0});var a=n("./passDownStateAndActions/child/state.js"),s=function(e){return e&&e.__esModule?e:{default:e}}(a),o=n("../src/sceneScope/index.js"),l=(0,o.sceneReducer)(r);t.default=l;!function(){"undefined"!=typeof __REACT_HOT_LOADER__&&(__REACT_HOT_LOADER__.register(r,"reducer","D:/Projects/redux-arena/example/passDownStateAndActions/child/reducer.js"),__REACT_HOT_LOADER__.register(l,"default","D:/Projects/redux-arena/example/passDownStateAndActions/child/reducer.js"))}()},"./passDownStateAndActions/child/state.js":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={name:"Child",cnt:0};t.default=r;!function(){"undefined"!=typeof __REACT_HOT_LOADER__&&__REACT_HOT_LOADER__.register(r,"default","D:/Projects/redux-arena/example/passDownStateAndActions/child/state.js")}()},"./passDownStateAndActions/index.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=n("./passDownStateAndActions/state.js"),s=r(a),o=n("./passDownStateAndActions/reducer.js"),l=r(o),u=n("./passDownStateAndActions/Parent.jsx"),c=r(u),d=n("./passDownStateAndActions/actions.js"),i=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(d),_={Component:c.default,state:s.default,actions:i,reducer:l.default,options:{vReducerKey:"parent"}};t.default=_;!function(){"undefined"!=typeof __REACT_HOT_LOADER__&&__REACT_HOT_LOADER__.register(_,"default","D:/Projects/redux-arena/example/passDownStateAndActions/index.js")}()},"./passDownStateAndActions/reducer.js":function(e,t,n){"use strict";function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s.default;switch(arguments[1].type){case"ADD_CNT":return Object.assign({},e,{cnt:e.cnt+1});default:return e}}Object.defineProperty(t,"__esModule",{value:!0});var a=n("./passDownStateAndActions/state.js"),s=function(e){return e&&e.__esModule?e:{default:e}}(a),o=n("../src/sceneScope/index.js"),l=(0,o.sceneReducer)(r);t.default=l;!function(){"undefined"!=typeof __REACT_HOT_LOADER__&&(__REACT_HOT_LOADER__.register(r,"reducer","D:/Projects/redux-arena/example/passDownStateAndActions/reducer.js"),__REACT_HOT_LOADER__.register(l,"default","D:/Projects/redux-arena/example/passDownStateAndActions/reducer.js"))}()},"./passDownStateAndActions/state.js":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={name:"Parent",cnt:0};t.default=r;!function(){"undefined"!=typeof __REACT_HOT_LOADER__&&__REACT_HOT_LOADER__.register(r,"default","D:/Projects/redux-arena/example/passDownStateAndActions/state.js")}()}});