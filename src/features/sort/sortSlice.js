import { createSlice } from '@reduxjs/toolkit';

const initialItems = [];

export const sortSlice = createSlice({
  name: 'sortItems',
  initialState: {
    sortItems: initialItems,
  },
  reducers: {
    toggleSortedItem: (state, {payload}) => {
        const itemIndex = state.sortItems.findIndex(({title}) => title === payload.title)

        if(itemIndex < 0) { 
            state.sortItems = [...payload];
        }
    },
  },
});

export const { toggleSortedItem } = sortSlice.actions;
export const showSortedItems = state => state.sortItems.sortItems;

export default sortSlice.reducer;