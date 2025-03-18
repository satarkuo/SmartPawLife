import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchValue } from "../redux/searchSlice";
import { setFilterProducts } from "../redux/productSlice";
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';

import useScreenSize from "../hooks/useScreenSize";

import banner1Lg from '../assets/img/banner/product/banner1-lg.png';
import banner1Md from '../assets/img/banner/product/banner1-md.png';

const bannerImgs = [
    {
        lg: banner1Lg,
        md: banner1Md,
        title: '探索專屬你的毛孩世界',
        content: '精選多品類寵物智能產品，打造全方位的幸福生活'
    }
]

//快速填入關鍵字
const tagList = [ '寵物', '智能', '逗貓棒']

const ProductLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    //swiper RWD:自訂hook
    const { screenWidth } = useScreenSize();
    const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false

    //RTK取得：全部產品列表
    const allProducts = useSelector(state => state.product.allProducts)
    //RTK取得：首頁輸入的搜尋關鍵字
    const searchValue = useSelector(state => state.search.searchValue)
    //RTK取得：首頁送出的的單一filter
    const singleFilter = useSelector(state => state.search.singleFilter)
    
    //篩選條件預設值
    const filterDefault = useMemo(() => ({
        category:'全部',
        is_discounted: false,
        is_newest: false,
        is_hottest: false
    }), [])

    //產品關鍵字篩選邏輯
    const [searchText, setSearchText] = useState('')
    const handleFilterKeywordProducts = useCallback(() => {
        dispatch(setSearchValue(''))
        setFiltersData(filterDefault)
        let result = [...allProducts];
        result = result.filter(product => product.title.includes(searchText))
        dispatch(setFilterProducts(result))
        setSearchText('')
        navigate(`/productList/search/${searchText}`)
        
    }, [allProducts, dispatch, filterDefault, navigate, searchText])

    //input:輸入搜尋關鍵字
    const handleInputChange = (e) => {
        const { value } = e.target;
        setSearchText(value)
    }

    //input:快速帶入關鍵字
    const handleTagSearch = (tag) => {
        setSearchText(tag)
        dispatch(setSearchValue(''))
        setFiltersData(filterDefault)
    }
       
    //篩選條件狀態
    const [filtersData, setFiltersData] = useState(filterDefault)
    //設定篩選條件
    const filters = {
        category: (product) => filtersData.category !== '全部' ? product.category === filtersData.category : true,
        is_discounted: (product) => filtersData.is_discounted ? product.origin_price > product.price : true,
        is_newest: (product) => filtersData.is_newest ? product.is_newest : true,
        is_hottest: (product) => filtersData.is_hottest ? product.is_hottest : true,
    }

    //產品篩選邏輯
    const handleFilterProducts = useCallback(() => {
        if (searchValue !== '' || singleFilter !== '') { return }
        let result = [...allProducts];

        result = result.filter((product) => (
            Object.values(filters).every((filter) => filter(product))
        ))
        dispatch(setFilterProducts(result));
        
    },[allProducts, dispatch, filtersData])

    const handleFilterClick = (filterName) => {        
        setFiltersData({
            ...filtersData,
            [filterName] : !filtersData[filterName], //切換true/false
        })
        handleFilterProducts();
        //change Name for render UI
        if (filterName ==='is_newest' && !filtersData[filterName] ){ 
            filterName = '新品報到'
        } else if (filterName ==='is_discounted'  && !filtersData[filterName] ) { 
            filterName = '限時搶購'
        } else if (filterName ==='is_hottest'  && !filtersData[filterName] ) { 
            filterName = '冠軍排行'
        } else {
            filterName = filtersData.category
        }
        navigate(`/productList/search/${filterName}`)
    }

    //category for breadcrumb
    const [category, setCategory] = useState('全部')
    const handleCategoryClick = (categoryName) => {
        setFiltersData({
            ...filtersData,
            category : categoryName,
        })
        handleFilterProducts();
        navigate(`/productList/search/${categoryName}`)
        setCategory(categoryName)
    }

    useEffect(() => {
        handleFilterProducts()
    },[handleFilterProducts])

    return (
        <>
            <section className="productListPage">
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                    spaceBetween={0} // 幻燈片之間的間距
                    slidesPerView={1} // 一次顯示幾張
                    //navigation // 左右箭頭
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    className='swiperBanner'
                    loop={bannerImgs.length >= 2}
                    >
                    {bannerImgs.map((img,i) => (
                        <SwiperSlide key={i}>
                            <div className='container detail text-center'>
                                <p className={isMobile? 'h4' : 'h2'}>{img.title}</p>
                                <p className={isMobile? 'h6 mobileMaxWidth' : 'h4'}>{img.content}</p>
                            </div>
                            <img src={isMobile ? img.md : img.lg} alt={img.title} className='w-100'/>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="container pb-5">
                    <div className="breadcrumb">
                        <Link className="breadLink" to='/'>
                            首頁
                            <span className="material-icons-outlined"></span>
                        </Link>
                        <Link className="breadLink" to='/productList'>{category}</Link>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className={`searchBar ${searchText ? 'active' : ''}`}>
                                <input type="search" placeholder="搜尋關鍵字" value={searchText}
                                    className="input px-3"
                                    onChange={handleInputChange}
                                    />
                                <button type="submit" 
                                    className="btn btn-primary"
                                    onClick={handleFilterKeywordProducts}>
                                    <span className="material-icons-outlined fs-5 align-self-center">arrow_forward</span>    
                                </button>
                            </div>
                            <div className="tagList d-flex gap-1 mb-3 mb-md-5 mt-2">
                                {tagList.map(tag => (
                                    <button type="text" key={tag}
                                    className="badge rounded-pill border-0 text-secondary"
                                    onClick={() => {handleTagSearch(tag)} }>{tag}</button>
                                ))}
                            </div>
                            <h6 className="h6 mb-3 d-none d-md-block">產品分類</h6>
                            <div className="categoryNavRWD">
                                <ul className="categoryNav">                                
                                    <li>
                                        <button type="button" 
                                            className={`btn categoryBtn ${filtersData.is_newest || (params.search === '新品報到') ? 'active' : ''}`}
                                            onClick={() => handleFilterClick('is_newest')}>
                                            <span className="material-icons">verified</span>新品報到
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" 
                                            className={`btn categoryBtn ${filtersData.is_hottest || (params.search === '冠軍排行') ? 'active' : ''}`}
                                            onClick={() => handleFilterClick('is_hottest')}>
                                            <span className="material-icons">local_fire_department</span>冠軍排行
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button"
                                            className={`btn categoryBtn ${filtersData.is_discounted || (params.search === '限時搶購') ? 'active' : ''}`}
                                            onClick={(() => handleFilterClick('is_discounted'))}>
                                            <span className="material-icons">timer</span>限時搶購
                                        </button>
                                    </li>                        
                                    <li>
                                        <button type="button" 
                                            className={`btn categoryBtn ${filtersData.category === '全部' ? 'active' : ''}`}
                                            onClick={() => handleCategoryClick('全部')}>
                                            <span className="material-icons">list</span>全部
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" 
                                            className={`btn categoryBtn ${filtersData.category === '智能戶外系列' ? 'active' : ''}`}
                                            onClick={() => handleCategoryClick('智能戶外系列')}>
                                            <span className="material-icons">light_mode</span>智能戶外系列
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" 
                                            className={`btn categoryBtn ${filtersData.category === '質感室內系列' ? 'active' : ''}`}
                                            onClick={() => handleCategoryClick('質感室內系列')}>
                                            <span className="material-icons">home</span>質感室內系列
                                        </button>
                                    </li>                                
                                </ul>  
                            </div>
                                                      
                            
                        </div>
                        <div className="col-md-9">
                            <Outlet />                            
                        </div>
                    </div>
                    
                </div>
            </section>
        </>
    )
}
export default ProductLayout;