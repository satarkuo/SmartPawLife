import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  carts: [],
  total: 0,
  final_total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCartData(state, action) {
      const { carts, total, final_total } = action.payload;
      state.carts = carts;
      state.total = total;
      state.final_total = final_total;
    },
    clearCartData(state) {
      state.carts = [];
      state.total = 0;
      state.final_total = 0;
    },
  },
});
export const { updateCartData, clearCartData } = cartSlice.actions;
export default cartSlice.reducer;
