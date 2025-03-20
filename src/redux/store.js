import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './toastSlice';
import cartReducer from './cartSlice';
import adminOrderReducer from './admin/adminOrderSlice';
import searchReducer from './searchSlice';
import productReducer from './productSlice';
import favoriteReducer from './favoriteListSlice';

export const store = configureStore({
    reducer: {
        toast: toastReducer,
        cart: cartReducer,
        adminOrder: adminOrderReducer,
        search: searchReducer,
        product: productReducer,
        favorite: favoriteReducer,
    }
})

export default store;