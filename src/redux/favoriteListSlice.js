import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { pushMessage } from './toastSlice';

export const toggleFavoriteList = createAsyncThunk(
  'favorite/toggleFavoriteList',
  async (productId, { dispatch, getState }) => {
    const prevList = getState().favorite.favoriteList; //取得當前清單
    const newFavoriteList = {
      ...prevList,
      [productId]: !prevList[productId], // toggle true/ false
    };
    localStorage.setItem('favoriteList', JSON.stringify(newFavoriteList)); //儲存至localStorage
    if (newFavoriteList[productId]) {
      dispatch(
        pushMessage({
          title: '已加入收藏',
          text: '成功新增至收藏清單',
          type: 'success',
        })
      );
    } else {
      dispatch(
        pushMessage({
          title: '已移除收藏',
          text: '從收藏清單中移除',
          type: 'warning',
        })
      );
    }
    return newFavoriteList;
  }
);

const initialState = {
  favoriteList: localStorage.getItem('favoriteList')
    ? JSON.parse(localStorage.getItem('favoriteList'))
    : {},
};

const favoriteListSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(toggleFavoriteList.fulfilled, (state, action) => {
      state.favoriteList = action.payload; //更新收藏清單
    });
  },
});
export default favoriteListSlice.reducer;
