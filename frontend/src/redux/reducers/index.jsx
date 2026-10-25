/**
 * --------------------------------------------------------
 * File        : index.js
 * Description : Combines all Redux slices and handles global state resets.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Uses combineReducers to include multiple slices (e.g., signin, onboarding).
 * - Clears persisted state from localStorage on logout action.
 * - Works with redux-persist to manage session data.
 */

import { combineReducers } from "redux";
import localStorage from "redux-persist/lib/storage";
import signin from "../../modules/sign-in/slice/signinSlice";
import profile from "../../modules/profile/slice/profileSlice";
import competition from "../../modules/competitions-page/slice/competitionSlice";

// Keep only essential slices for a clean starter.
const appReducer = combineReducers({
  signin,
  profile,
  competition,
});

export const rootReducer = (state, action) => {
  if (action.type === "signin/logout") {
    // this applies to all keys defined in persistConfig(s)
    localStorage.removeItem("persist:root");
    state = {};
  }
  return appReducer(state, action);
};
