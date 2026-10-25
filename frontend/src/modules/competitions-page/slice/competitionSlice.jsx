/**
 * --------------------------------------------------------
 * File        : adminSlice.jsx
 * Description : Redux slice for handling admin-related API
 *               calls, including agent list and CSV export.
 * Author      : Developer Team
 * Created On  : 2025-05-07
 * Updated On  : 2025-05-07
 * --------------------------------------------------------
 * Notes:
 * - Uses `createAsyncThunk` to fetch back office agents and export data as CSV.
 * - Manages `status` state for async operations (loading, succeeded, failed).
 * - Handles both network and server-side errors with appropriate rejection flows.
 */

import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllCountry } from "./competitionAction";

// Initial state for the onboarding slice
const initialState = {
    status: "idle",
    isLoggedIn: false,
};

export const fetchAllCountry = createAsyncThunk(
    "FETCH_ALL_COUNTRY",
    async (requestObject, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { status, data } = await getAllCountry(requestObject);
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


export const competitionSlice = createSlice({
    name: "competition",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
    },
});
export const { setNoDataPlaceholder } = competitionSlice.actions;
export default competitionSlice.reducer;