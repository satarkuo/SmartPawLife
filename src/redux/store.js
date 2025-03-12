import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './toastSlice';
import cartReducer from './cartSlice';
import adminOrderReducer from './admin/adminOrderSlice';

export const store = configureStore({
    reducer: {
        toast: toastReducer,
        cart: cartReducer,
        adminOrder: adminOrderReducer
    }
})

export default store;