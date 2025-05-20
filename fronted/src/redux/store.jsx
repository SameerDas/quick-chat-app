import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./loaderSlice";
import userReducer from "./usersSlice";
let store=configureStore({
  reducer:{loaderReducer,userReducer}
});
export default store;