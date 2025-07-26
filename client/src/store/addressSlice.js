import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addresses: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    addAddress: (state, action) => {
      state.addresses = [...action.payload];
    },
  },
});

export const { addAddress } = addressSlice.actions;

export default addressSlice.reducer;
