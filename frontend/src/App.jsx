/**
 * --------------------------------------------------------
 * File        : App.jsx
 * Description : Root component that sets up Redux store, persistence,
 *               routing, and offline state handling for the application.
 * Authors     : Developer team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Integrates Redux store with redux-persist for state persistence.
 * - Detects and responds to online/offline network status.
 * - Wraps the app with a global API response checker.
 */

import { createContext, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Routing from "./router";
import { NoInternet } from "./components";
import checkApiResponse from "./components/check-api-response";
import store from "../src/redux/store/configureStore";
import 'rc-tooltip/assets/bootstrap.css';

export const AppContext = createContext();

const persistor = persistStore(store);

function App() {
  const [hasInternet, setHasInternet] = useState(navigator.onLine);

  useEffect(() => {
    const setOffline = () => setHasInternet(false);
    const setOnline = () => setHasInternet(true);
    window.addEventListener("offline", setOffline);
    window.addEventListener("online", setOnline);
    return () => {
      window.removeEventListener("offline", setOffline);
      window.removeEventListener("online", setOnline);
    };
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {!hasInternet && <NoInternet />}
           {/* {isLoading ? <CircularLoader /> : null}
          <AppContext.Provider value={appProps}> */}
            <Routing />
          {/* </AppContext.Provider> */}
        </PersistGate>
      </Provider>
    </>
  );
}

export default checkApiResponse(App);
