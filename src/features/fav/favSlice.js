import {createSlice} from '@reduxjs/toolkit';

const initialFav = localStorage.getItem('fav')
  ? JSON.parse(localStorage.getItem('fav'))
  : []

export const favSlice = createSlice({
    name: 'fav',
    initialState: {
        fav: initialFav
    },
    reducers: {
        add: (state, {payload}) => {
            state.fav.push(payload)
            localStorage.setItem('fav', JSON.stringify(state.fav))
        },
        del: (state, {payload}) => {
            state.fav = state.fav.filter(({title}) => title !== payload.title);
            localStorage.setItem('fav', JSON.stringify(state.fav));
        }
    }
})


export const {add, del} = favSlice.actions;


export const showFavorites = state => state.fav.fav;


export default favSlice.reducer;