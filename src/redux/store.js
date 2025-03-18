import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './toastSlice';
import cartReducer from './cartSlice';
import adminOrderReducer from './admin/adminOrderSlice';
import searchReducer from './searchSlice';
import productReducer from './productSlice';

export const store = configureStore({
    reducer: {
        toast: toastReducer,
        cart: cartReducer,
        adminOrder: adminOrderReducer,
        search: searchReducer,
        product: productReducer,
    }
})

export default store;