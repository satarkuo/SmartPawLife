import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    searchValue: '', //首頁Home.jsx、產品頁ProductLayout.jsx 共用的搜尋關鍵字
    selectedFilters: {
        category: '全部', //分類
        is_discounted: false, //限時搶購
        is_newest: false, //新品報到
        is_hottest: false, //熱門商品、冠軍排行
    },
    singleFilter: '', //首頁：單一分類filter條件：限時優惠、熱門產品、最新產品
}
const searchSlice = createSlice({
    name:'search',
    initialState,
    reducers: {
        setSearchValue: (state, action) => {
            state.searchValue = action.payload;            
        },
        setSelectedFilters: (state, action) => { //產品filter條件
            state.selectedFilters.category = action.payload.category;
            state.selectedFilters.is_discounted = action.payload.is_discounted;
            state.selectedFilters.is_newest = action.payload.is_newest;
            state.selectedFilters.is_hottest = action.payload.is_hottest;
        },
        setSingleFilter: (state, action) => { //首頁：單一分類filter條件
            state.singleFilter = action.payload;
        },
        resetSelectedFilters: (state) => {
            state.selectedFilters = {
                category: '全部',
                is_discounted: false,
                is_newest: false, 
                is_hottest: false, 
            }
        },
    }
})
export const { setSearchValue, setSelectedFilters, setSingleFilter, resetSelectedFilters } = searchSlice.actions;
export default searchSlice.reducer;