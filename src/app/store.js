import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import favReducer from '../features/fav/favSlice';
import cartItemsReducer from '../features/cart/cartSlice';
import sortItemsReducer from '../features/sort/sortSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    fav: favReducer,
    cartItems: cartItemsReducer,
    sortItems: sortItemsReducer
  },
});
