import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  orderData: {},
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderData: (state, action) => {
      //儲存成功建立的訂單資訊
      state.orderData = action.payload;
    },
  },
});
export const { setOrderData } = orderSlice.actions;
export default orderSlice.reducer;
