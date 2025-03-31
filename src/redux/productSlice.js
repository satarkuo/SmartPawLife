import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  products: [],
  allProducts: [],
  filterProducts: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      //全部產品(分頁/每頁十筆)
      state.products = action.payload;
    },
    setAllProducts: (state, action) => {
      //全部產品(不分頁)
      state.allProducts = action.payload;
    },
    setFilterProducts: (state, action) => {
      //產品搜尋結果
      state.filterProducts = action.payload;
    },
  },
});

export const { setProducts, setAllProducts, setFilterProducts } = productSlice.actions;
export default productSlice.reducer;
