import { combineReducers } from "redux";

import userReducer from "./userReducer";

// now we will create a rootReducer

const rootReducer = combineReducers({ userReducer: userReducer });
export default rootReducer;
