import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import DevTools from "./frame/DevTools";
import { createArenaStore } from "redux-arena";
import saga from "./frame/redux/saga";
import reducer from "./frame/redux/reducer";
import state from "./frame/redux/state";

const enhancers = [applyMiddleware(thunk), DevTools.instrument()];

export default function configureStore(history) {
  const store = createArenaStore(
    { frame: reducer },
    { frame: state },
    saga,
    enhancers
  );
  return store;
}
