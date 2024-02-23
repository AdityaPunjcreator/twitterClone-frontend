import rootReducer from "./Reducer/rootReducer";
import { createStore } from "redux";
// creating a centralized store
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // using the redux dev tool extension to inspect the state and action in Redux store
);

export default store;
