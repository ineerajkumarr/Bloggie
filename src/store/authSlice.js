import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: null,
    docs: [],
  },
  reducers: {
    login: (state, action) => {
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      state.userId = null;
      state.docs = [];
    },
    listDocs: (state, action) => {
      state.docs = action.payload;
      // console.log("Docs are :", state.docs);
    },
  },
});

export const { login, logout, listDocs } = authSlice.actions;

export default authSlice.reducer;
