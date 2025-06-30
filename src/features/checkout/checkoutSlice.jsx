import { createSlice } from "@reduxjs/toolkit";

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    isCheckout: false,
  },
  reducers: {
    toggleCheckout: (state, { payload }) => {
      state.isCheckout = payload;
    },
  },
});

export const { toggleCheckout } = checkoutSlice.actions;
export const selectIsCheckout = (state) => state.checkout.isCheckout;
export default checkoutSlice.reducer;
