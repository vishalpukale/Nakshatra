/**
 * --------------------------------------------------------
 * File        : profileSlice.jsx
 * Description : Redux slice and async thunks for managing agent onboarding
 *               including location, SSN verification, declarations, and tax info.
 * Authors     : Developer team
 * Created On  : 2025-05-12
 * Updated On  : 2025-05-12
 * --------------------------------------------------------
 * Notes:
 * - Uses createAsyncThunk to handle API calls with robust error handling.
 * - State includes personal info, and tax data.
 * - Each thunk supports success/failure status updates in Redux state.
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getDirectDepositById,
  getEAndODataById,
  getProfileDataById,
  getStateLicenseById,
  updateDirectDeposit,
  updateProfileDetails,
  getNotificationData,
  getAgentAddressByAgentId,
  updateEAndO,
  updateStateLicense,
  getAllAgent,
  updateStatus,
  getAgentCarrier,
  getAgentDocuments,
  getActivityLog,
  getAllCertificate,
  getCertificateById,
  createCertificate,
  fetchAgentCertificatesByCode,
  deleteCertificate,
  updateCertificate,
  fetchAllAgentLevels,
  updateLevel,
  getLicenseById,
  getUplineAgentAndTopAgentData,
} from "./profileAction";

const initialState = {
  status: "idle",
  isLoggedIn: false,
  isLoading: false,
  certificates: [],
  activityLog: [],
  stateLicenseData: [],
  isContractRendering: false,
  isCarrierRendering: false,
};

// Fetch agent profile details by userId
export const fetchProfileData = createAsyncThunk(
  "GET_AGENT_PROFILE_DETAIL_BY_ID",
  async (requestObject) => {
    const data = await getProfileDataById(requestObject);
    return { status: data.status, data: data.data };
  },
);

// Fetch agent address by agentId
export const fetchAgentAddress = createAsyncThunk(
  "GET_AGENT_ADDRESS_BY_AGENT_ID",
  async (requestObject) => {
    const data = await getAgentAddressByAgentId(requestObject);
    return { status: data.status, data: data.data };
  },
);

// Update agent profile details
export const updateProfileData = createAsyncThunk(
  "UPDATE_AGENT_PROFILE",
  // async (requestObject) => {
  //   const data = await updateProfileDetails(requestObject);
  //   return { status: data.status, data: data.data };
  // },
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await updateProfileDetails(requestObject);
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

// Fetch direct deposit info
export const fetchDirectDepositData = createAsyncThunk(
  "GET_DIRECT_DEPOSIT_DETAIL_BY_ID",
  async (requestObject) => {
    const data = await getDirectDepositById(requestObject);
    return { status: data.status, data: data.data };
  },
);

// Update direct deposit
export const updateDirectDepositData = createAsyncThunk(
  "UPDATE_DIRECT_DEPOSIT",
  async (requestObject) => {
    const data = await updateDirectDeposit(requestObject);
    return { status: data.status, data: data.data };
  },
);

// Fetch E&O (Errors & Omissions) details
export const fetchEAndOData = createAsyncThunk(
  "GET_E_AND_O_DETAILS_BY_ID",
  async (requestObject) => {
    const data = await getEAndODataById(requestObject);
    return { status: data.status, data: data.data };
  },
);

// Fetch state license info
export const fetchStateLicenseData = createAsyncThunk(
  "GET_SATE_LICENSE_DETAILS_BY_ID",
  async (requestObject) => {
    const data = await getStateLicenseById(requestObject);
    return { status: data.status, data: data.data };
  },
);

export const fetchLicenseData = createAsyncThunk(
  "GET_LICENSE_DETAILS_BY_ID",
  async (requestObject) => {
    const data = await getLicenseById(requestObject);
    return { status: data.status, data: data.data };
  },
);

// Fetch agent-specific notifications
export const fetchNotificationDataByAgentId = createAsyncThunk(
  "GET_NOTIFICATION_DATA",
  async (requestObject) => {
    const data = await getNotificationData(requestObject);
    return { status: data.status, data: data.data };
  },
);

// Update E&O insurance (with file upload)
export const updateAgentEAndO = createAsyncThunk(
  "UPDATE_AGENT_PROFILE",
  async (requestObject) => {
    const data = await updateEAndO(requestObject);
    return { status: data.status, data: data.data };
  },
);

// Update agent's state license (with file upload)
export const updateAgentStateLicense = createAsyncThunk(
  "UPDATE_AGENT_STATE_LICENSE",
  async (requestObject) => {
    const data = await updateStateLicense(requestObject);
    return { status: data.status, data: data.data };
  },
);

// Fetch contract requests for an agent
export const getAllAgentContract = createAsyncThunk(
  "GET_REQUEST_CONTRACT",
  async (requestObject) => {
    const data = await getAllAgent(requestObject);
    return { status: data.status, data: data.data };
  },
);

// Fetch carrier appointment data for agent
export const getAllAgentCarrier = createAsyncThunk(
  "GET_ALL_AGENT_CARRIER",
  async (requestObject) => {
    const data = await getAgentCarrier(requestObject);
    return { status: data.status, data: data.data };
  },
);

// Update contract request status
export const updateContractStatus = createAsyncThunk(
  "UPDATE_CONTRACT_STATUS",
  async ({ id, status }) => {
    const data = await updateStatus({ id, status });
    return { status: data.status, data: data.data };
  },
);

// Fetch agent-uploaded documents
export const fetchAgentDocuments = createAsyncThunk(
  "FETCH_AGENT_DOCUMENTS",
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await getAgentDocuments(requestObject);
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

// Fetch agent activity logs
export const fetchActivityLog = createAsyncThunk(
  "FETCH_ACTIVITY_LOG",
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await getActivityLog(requestObject);
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

// Create a new certificate for agent
export const createAgentCertificate = createAsyncThunk(
  "CREATE_AGENT_CERTIFICATE",
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await createCertificate(requestObject);
      return fulfillWithValue({ status, data });
    } catch (error) {
      return rejectWithValue(error?.response || error);
    }
  },
);

// Get all agent certificates
export const getAllAgentCertificates = createAsyncThunk(
  "GET_ALL_AGENT_CERTIFICATE",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getAllCertificate();
      return data;
    } catch (error) {
      return rejectWithValue(error?.response || error);
    }
  },
);

// Fetch single certificate by ID
export const getAgentCertificateById = createAsyncThunk(
  "GET_AGENT_CERTIFICATE_BY_ID",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } = await getCertificateById({ id });
      return data;
    } catch (error) {
      return rejectWithValue(error?.response || error);
    }
  },
);

// Update agent certificate
export const updateAgentCertificate = createAsyncThunk(
  "UPDATE_AGENT_CERTIFICATE",
  async (requestObject) => {
    const data = await updateCertificate(requestObject);
    return { status: data.status, data: data.data };
  },
);

// Delete agent certificate by ID
export const deleteAgentCertificate = createAsyncThunk(
  "DELETE_AGENT_CERTIFICATE",
  async ({ id, updatedBy }, { rejectWithValue }) => {
    try {
      const { data } = await deleteCertificate({ id, updatedBy });
      return data;
    } catch (error) {
      return rejectWithValue(error?.response || error);
    }
  },
);

// Fetch certificates by agentId and code
export const getAgentCertificateByCode = createAsyncThunk(
  "GET_AGENT_CERTIFICATE_BY_CODE",
  async (requestObject, { rejectWithValue }) => {
    try {
      const { data } = await fetchAgentCertificatesByCode(requestObject);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response || error);
    }
  },
);

// Get available agent levels
export const getAllAgentLevels = createAsyncThunk(
  "GET_AGENT_LEVEL",
  async (requestObject) => {
    const data = await fetchAllAgentLevels(requestObject);
    return { status: data.status, data: data.data };
  },
);

// Update agent's current level
export const updateAgentLevel = createAsyncThunk(
  "UPDATE_AGENT_LEVEL",
  async (requestObject) => {
    const data = await updateLevel(requestObject);
    return { status: data.status, data: data.data };
  },
);


// Fetch upline and top agent 
export const fetchUplineAgentAndTopAgentData = createAsyncThunk(
  "FETCH_UPLINE_AGENT_AND_TOP_AGENT_DATA",
  async (requestObject, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { status, data } = await getUplineAgentAndTopAgentData(requestObject);
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


// Slice definition for profile onboarding
export const onBoardingSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setContractRendering: (state) => {
      state.isContractRendering = true;
    },
    setCarrierRendering: (state) => {
      state.isCarrierRendering = true;
    },
  },
  


  extraReducers: (builder) => {
    builder
      .addCase(updateProfileData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfileData.fulfilled, (state, { payload }) => {
        const { data } = payload?.data || {};
        state.status = "succeeded";
      })
      .addCase(updateProfileData.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAgentDocuments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAgentDocuments.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(fetchAgentDocuments.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(createAgentCertificate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAgentCertificate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.certificates.push(action.payload.data.agent);
      })
      .addCase(createAgentCertificate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getAllAgentCertificates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllAgentCertificates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.certificates = action.payload.agents || [];
      })
      .addCase(getAllAgentCertificates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getAgentCertificateById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAgentCertificateById.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.certificate = action.payload.agent;
      })
      .addCase(getAgentCertificateById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(updateAgentCertificate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAgentCertificate.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.certificate = action.payload.agent;
      })
      .addCase(updateAgentCertificate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(deleteAgentCertificate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAgentCertificate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.certificates = state.certificates.filter(
          (cert) => cert.id !== action.payload.agent.id,
        );
      })
      .addCase(deleteAgentCertificate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getAgentCertificateByCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAgentCertificateByCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.certificates = action.payload.agents || [];
      })
      .addCase(getAgentCertificateByCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchActivityLog.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchActivityLog.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.activityLog = payload.data.data;
      })
      .addCase(fetchActivityLog.rejected, (state) => {
        state.isLoading = false;
        state.status = "failed";
      })
      .addCase(fetchStateLicenseData.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchStateLicenseData.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.stateLicenseData = payload?.data?.data;
      })
      .addCase(fetchStateLicenseData.rejected, (state) => {
        state.isLoading = false;
        state.status = "failed";
      })
      .addCase(getAllAgentCarrier.pending, (state) => {
        state.isLoading = true;
        (state.isCarrierRendering = false), (state.status = "loading");
      })
      .addCase(getAllAgentCarrier.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.status = "succeeded";
      })
      .addCase(getAllAgentCarrier.rejected, (state) => {
        state.isLoading = false;
        state.status = "failed";
      })
      .addCase(getAllAgentContract.pending, (state) => {
        state.isLoading = true;
        (state.isContractRendering = false), (state.status = "loading");
      })
      .addCase(getAllAgentContract.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.status = "succeeded";
      })
      .addCase(getAllAgentContract.rejected, (state) => {
        state.isLoading = false;
        state.status = "failed";
      });
  },
});
export const { setContractRendering } = onBoardingSlice.actions;
export const { setCarrierRendering } = onBoardingSlice.actions;
export default onBoardingSlice.reducer;
