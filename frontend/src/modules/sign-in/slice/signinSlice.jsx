/**
 * --------------------------------------------------------
 * File        : signinSlice.js
 * Description : Redux slice for authentication-related logic:
 *               - Admin Sign-in
 *               - Agent Sign-in (OTP flow)
 *               - Account Creation for Agent
 *               - Advertisement fetching for login screen
 * Authors     : Developer Team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-15
 * --------------------------------------------------------
 * Notes:
 * - Uses `createAsyncThunk` for handling API side effects.
 * - Manages login status, user data, and token storage.
 * - Supports Admin and Agent login flows.
 */

import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  signInAdminUser,
  fetchOTP,
  signInAgentUser,
  createAgent,
  getAdvertisementBYforScreen,
  deleteAgent,
  getUserAccessModule,
  resetAdminPassword,
  activateAgent,
  getAllCountry,
} from "./signinAction";
import { setToken } from "../../../services/utils";

const initialState = {
  status: "idle",
  isLoggedIn: false,
  userId: "",
  agentAccountStatus: "Agent",
  userData: {},
  userAccessModule:[], 
  countryOptions:[],
};

// export const logout = createAction("LOGOUT");

export const signInAsAdmin = createAsyncThunk(
  "SIGN_IN_AS_ADMIN",
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await signInAdminUser(requestObject);
      return fulfillWithValue({ status, data }); // axios wraps the response in a `data` property
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;
        return rejectWithValue({ status, data });
      }
      // Network or other errors
      return rejectWithValue(error);
    }
  },
);

// Thunk: Fetch OTP for agent
export const getOTP = createAsyncThunk(
  "GET_OTP",
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await fetchOTP(requestObject);
      return fulfillWithValue({ status, data }); // axios wraps the response in a `data` property
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;
        return rejectWithValue({ status, data });
      }
      // Network or other errors
      return rejectWithValue(error);
    }
  },
);



// Thunk: Agent sign-in
export const signInAsAgent = createAsyncThunk(
  "SIGN_IN_AS_AGENT",
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await signInAgentUser(requestObject);
      return fulfillWithValue({ status, data }); // axios wraps the response in a `data` property
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;
        return rejectWithValue({ status, data });
      }
      // Network or other errors
      return rejectWithValue(error);
    }
  },
);

// Thunk: Create Agent account
export const createAgentAccount = createAsyncThunk(
  "CREATE_AGENT_ACCOUNT",
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await createAgent(requestObject);
      return fulfillWithValue({ status, data }); // axios wraps the response in a `data` property
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;
        return rejectWithValue({ status, data });
      }
      // Network or other errors
      return rejectWithValue(error);
    }
  },
);

// Thunk: Fetch advertisement images
export const getAdvertise = createAsyncThunk(
  "GET_ADVERTISEMENT_IMAGES",
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await getAdvertisementBYforScreen(requestObject);
      return fulfillWithValue({ status, data }); // axios wraps the response in a `data` property
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;
        return rejectWithValue({ status, data });
      }
      // Network or other errors
      return rejectWithValue(error);
    }
  },
);
// getAllCountry
export const fetchAllCountry = createAsyncThunk(
  "GET_ALL_COUNTRY",
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await getAllCountry(requestObject);
      return fulfillWithValue({ status, data }); // axios wraps the response in a `data` property
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;
        return rejectWithValue({ status, data });
      }
      // Network or other errors
      return rejectWithValue(error);
    }
  },
);

export const deleteAgentAccount = createAsyncThunk(
  "DELETE_AGENT_ACCOUNT",
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await deleteAgent(requestObject);
      return fulfillWithValue({ status, data }); 
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;
        return rejectWithValue({ status, data });
      }
      // Network or other errors
      return rejectWithValue(error);
    }
  },
);
export const activateAgentAccount = createAsyncThunk(
  "ACTIVATE_AGENT_ACCOUNT",
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await activateAgent(requestObject);
      return fulfillWithValue({ status, data }); 
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;
        return rejectWithValue({ status, data });
      }
      // Network or other errors
      return rejectWithValue(error);
    }
  },
);

export const fetchUserAccessModule = createAsyncThunk(
  "GET_USER_ACCESS_MODULE",
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await getUserAccessModule(requestObject);
      return fulfillWithValue({ status, data }); // axios wraps the response in a `data` property
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;
        return rejectWithValue({ status, data });
      }
      // Network or other errors
      return rejectWithValue(error);
    }
  },
);
export const resetUserPassword = createAsyncThunk(
  "RESET_USER_PASSWORD",
  async (requestObject, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { status, data } = await resetAdminPassword(requestObject);
      return fulfillWithValue({ status, data });
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        return rejectWithValue({ status, data });
      }
      return rejectWithValue(error);
    }
  },
);

export const updateAgentProfileData = createAction("UPDATE_AGENT_PROFILE_DATA");
export const updateAgentEmail = createAction("UPDATE_AGENT_PROFILE_EMAIL");

export const signInSlice = createSlice({
  name: "signin",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAsAdmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signInAsAdmin.fulfilled, (state, { payload }) => {
        const { user, token } = payload?.data?.data || {};
        if(user.mustResetPassword){
          state.isLoggedIn= false
        }else{
          state.isLoggedIn = true;
        }
        state.userData = user;
        state.userAccessModule =user.userAccess;
        state.agentAccountStatus = user?.status;
        setToken(token);
        state.status = "succeeded";
      })
      .addCase(signInAsAdmin.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(signInAsAgent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signInAsAgent.fulfilled, (state, { payload }) => {
        state.isLoggedIn = true;
        const { token, user } = payload?.data?.data || {};
        state.status = "succeeded";
        state.userId = user?.id;
        state.userData = user;
        state.userAccessModule =user.userAccess;
        state.agentAccountStatus = user?.status;
        setToken(token);
      })
      .addCase(signInAsAgent.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(createAgentAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAgentAccount.fulfilled, (state, { payload }) => {
        const { token, user } = payload?.data?.data;
        state.status = "succeeded";
        state.agentAccountStatus = user.status;
        state.userData = user;
        state.userAccessModule =user.userAccess;
        setToken(token);
      })
      .addCase(createAgentAccount.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getOTP.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOTP.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
      })
      .addCase(getOTP.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(getAdvertise.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAdvertise.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
      })
      .addCase(getAdvertise.rejected, (state) => {
        state.status = "failed";
      })

      
      .addCase(fetchAllCountry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCountry.fulfilled, (state, { payload }) => {
         state.countryOptions = payload.data.data;
        state.status = "succeeded";
      })
      .addCase(fetchAllCountry.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(updateAgentProfileData, (state, { payload }) => {
        state.userData = {
          ...state.userData,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
        };
      
      })
      .addCase(updateAgentEmail, (state, { payload }) => {
        state.userData = {
          ...state.userData,
          email: payload,
        };
       
      })
      .addCase('signin/logout', (state) => {
        return {
          ...initialState,
        };
      })
    .addCase(deleteAgentAccount.pending, (state) => {
      state.status = "loading";
    })
    .addCase(deleteAgentAccount.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
    })
    .addCase(deleteAgentAccount.rejected, (state) => {
      state.status = "failed";
    })
    .addCase(fetchUserAccessModule.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchUserAccessModule.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
    state.userData = {
    ...state.userData,
    userAccess: payload?.data?.data,
  };
    })
    .addCase(fetchUserAccessModule.rejected, (state) => {
      state.status = "failed";
    })
    .addCase(resetUserPassword.fulfilled, (state) => {
      state.status = "succeeded";
      state.isLoggedIn = true;
    })

  },
});
export const { logout } = signInSlice.actions;
export default signInSlice.reducer;
export const selectUserLoggedIn = (state) => state.signin.isLoggedIn;
