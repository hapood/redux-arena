import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createArenaStore } from "redux-arena";
import saga from "./frame/redux/saga";
import reducer from "./frame/redux/reducer";
import state from "./frame/redux/state";

const enhancers = [applyMiddleware(thunk)];

export default function configureStore(history) {
  const store = createArenaStore(
    { frame: reducer },
    { frame: state },
    enhancers
  );
  store.runSaga(saga);
  return store;
}
