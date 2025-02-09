import { createSlice } from "@reduxjs/toolkit";

const loadSlice = createSlice({
  name: "loading",
  initialState: {
    loading: false,
  },
  reducers: {
    loading: (state) => {
      state.loading = true;
      // console.log("reached slice");
    },
    loaded: (state) => {
      state.loading = false;
    },
  },
});

export const { loading, loaded } = loadSlice.actions;

export default loadSlice.reducer;
