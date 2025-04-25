import { createSlice } from "@reduxjs/toolkit";

const initialItems = [];

export const sortSlice = createSlice({
  name: "sortItems",
  initialState: {
    sortItems: initialItems,
  },
  reducers: {
    toggleSortedItem: (state, { payload }) => {
      state.sortItems = payload; // Update the state with the sorted items
    },
    resetSortedItems: (state) => {
      state.sortItems = [];
    },
  },
});

export const { toggleSortedItem, resetSortedItems } = sortSlice.actions;
export const showSortedItems = (state) => {
  return state.sortItems.sortItems; // Return the sorted items
};

export default sortSlice.reducer;
