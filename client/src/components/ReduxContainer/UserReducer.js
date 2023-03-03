import { createSlice } from "@reduxjs/toolkit";

export const userReducer = createSlice({
  name: "User",
  initialState: {
    user: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },
    loginReset: (state) => {
      state.isFetching = false;
      state.error = false;
      state.errorMessage = null;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { loginStart, loginSuccess, loginReset, loginFailure, logout } =
  userReducer.actions;

export default userReducer.reducer;
