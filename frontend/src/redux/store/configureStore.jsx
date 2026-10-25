/**
 * --------------------------------------------------------
 * File        : configureStore.js
 * Description : Redux store configuration file for both development and production.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Uses Redux Toolkit for simplified store configuration.
 * - Integrates redux-persist to enable state persistence in localStorage.
 * - Includes redux-logger for development logging (can be toggled).
 * - Prevents serialization warnings for redux-persist actions.
 * - The commented conditional export can be used to split dev/prod configs.
 */

// let configureStore;

// if (import.meta.env.VITE_APP_ENABLE_REDUX_LOG === "false") {
//   configureStore = (await import("../store/configureStore.prod")).default;
// } else {
//   configureStore = (await import("../store/configureStore.dev")).default;
// }

// export default configureStore;
/**
 * --------------------------------------------------------
 * File        : configureStore.js
 * Description : Redux store configuration file for both development and production.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Uses Redux Toolkit for simplified store configuration.
 * - Integrates redux-persist to enable state persistence in localStorage.
 * - Includes redux-logger for development logging (can be toggled).
 * - Prevents serialization warnings for redux-persist actions.
 * - The commented conditional export can be used to split dev/prod configs.
 */


import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../reducers";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import localStorage from "redux-persist/lib/storage";

const persistConfig = {
  timeout: 5,
  key: "root",
  version: 1,
  storage: localStorage,
  debug: false,
  blacklist: [""],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: false,
});

export default store;
