import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  orders: [],
};

const adminOrderSlice = createSlice({
  name: 'adminOrder',
  initialState,
  reducers: {
    getPageOrdersData(state, action) {
      state.orders = action.payload;
    },
  },
});
export const { getPageOrdersData } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
