import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    docs: [],
    globalDocs: [],
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.docs = [];
    },
    listDocs: (state, action) => {
      state.docs = action.payload;
      // console.log("Docs are :", state.docs);
    },
    listGlobalDocs: (state, action) => {
      state.globalDocs = action.payload;
      // console.log("Global Docs are :", state.globalDocs);
    },
  },
});

export const { login, logout, listDocs, listGlobalDocs } = authSlice.actions;

export default authSlice.reducer;
