import { createSlice } from '@reduxjs/toolkit';


const initialuser = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: initialuser
  },
  reducers: {
    login: (state, {payload}) => {
      state.user = payload
      localStorage.setItem('user', JSON.stringify(payload))
    }, 
    logout: state => {
      state.user = null
      localStorage.removeItem('user')
    }
  },
});

export const { login, logout } = userSlice.actions;


export const selectUser = state => state.user.user;

export default userSlice.reducer;
