import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllProducts, setFilterProducts } from '../redux/productSlice';
import { setSearchValue, setSingleFilter } from '../redux/searchSlice';
import { pushMessage } from '../redux/toastSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import useScreenSize from '../hooks/useScreenSize';
import banner1Lg from '../assets/img/banner/product/banner1-lg.png';
import banner1Md from '../assets/img/banner/product/banner1-md.png';
import axios from 'axios';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const bannerImgs = [
  {
    lg: banner1Lg,
    md: banner1Md,
    title: '探索專屬你的毛孩世界',
    content: '精選多品類寵物智能產品，打造全方位的幸福生活',
  },
];

//快速填入關鍵字
const tagList = ['寵物', '智能', '逗貓棒'];

const ProductLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  //RWD:自訂hook
  const { screenWidth } = useScreenSize();
  const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false

  //RTK取得：全部產品列表
  const allProducts = useSelector((state) => state.product.allProducts);
  //RTK取得：首頁輸入的搜尋關鍵字
  const searchValue = useSelector((state) => state.search.searchValue);
  //RTK取得：首頁送出的的單一filter
  const singleFilter = useSelector((state) => state.search.singleFilter);

  //篩選條件預設值
  const filterDefault = useMemo(
    () => ({
      category: '全部',
      is_discounted: false,
      is_newest: false,
      is_hottest: false,
    }),
    []
  );

  //產品關鍵字篩選邏輯
  const [searchText, setSearchText] = useState(''); //產品頁搜尋關鍵字input值
  const handleFilterKeywordProducts = useCallback(() => {
    dispatch(setSearchValue('')); //清空RTK關鍵字欄位，避免被首頁輸入的關鍵字搜尋影響
    setFiltersData(filterDefault); //將篩選條件重置回預設，確保以全部產品進行搜尋，避免送出篩選時交叉篩選影響結果
    let result = [...allProducts];
    result = result.filter((product) => product.title.includes(searchText));
    dispatch(setFilterProducts(result)); //RTK儲存篩選結果，預計於 SearchProductResult.jsx 結果頁面顯示
    setSearchText(''); //清空input欄位
    navigate(`/productList/search/${searchText}`); //路由切換至結果頁面
  }, [allProducts, dispatch, filterDefault, navigate, searchText]);

  //input:輸入搜尋關鍵字
  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  //input:快速帶入關鍵字
  const handleTagSearch = (tag) => {
    setSearchText(tag);
    dispatch(setSearchValue('')); //清空RTK關鍵字欄位，避免被首頁輸入的關鍵字搜尋影響
    setFiltersData(filterDefault); //將篩選條件重置回預設，確保以全部產品進行搜尋，避免送出篩選時交叉篩選影響結果
  };

  //篩選條件狀態
  const [filtersData, setFiltersData] = useState(filterDefault);
  //設定篩選條件
  const filters = useMemo(
    () => ({
      category: (product) =>
        filtersData.category !== '全部' ? product.category === filtersData.category : true,
      is_discounted: (product) =>
        filtersData.is_discounted ? product.origin_price > product.price : true,
      is_newest: (product) => (filtersData.is_newest ? product.is_newest : true),
      is_hottest: (product) => (filtersData.is_hottest ? product.is_hottest : true),
    }),
    [filtersData]
  );

  //產品篩選邏輯
  const handleFilterProducts = useCallback(() => {
    // singleFilter(首頁點選更多限時優惠、熱門產品、最新產品)
    // searchValue(首頁搜尋關鍵字)
    // 初始化執行：
    // -> 1. 若singleFilter有值則取值，並以全部產品進行篩選與渲染UI
    // -> 2. 若singleFilter無值，則判斷searchValue是否有值，並以全部產品進行篩選與渲染UI
    // -> 3. 以上皆無，才以全部產品套用filtersData篩選條件進行篩選(預設篩選條件為顯示全部)
    if (singleFilter !== '') {
      dispatch(setSearchValue(''));
      let result = [...allProducts];
      //「讀取RTK：首頁點選的篩選分類」-> 根據分類拆選產品
      if (singleFilter === 'is_discounted') {
        //限時優惠：篩選 有折扣 的商品
        result = result.filter((product) => product.origin_price > product.price);
      } else {
        //熱門產品、最新產品：篩選 is_hottest、is_newest 為true的商品
        result = result.filter((product) => product[singleFilter]);
      }
      dispatch(setFilterProducts(result)); //帶入搜尋結果，渲染UI
      dispatch(setSingleFilter('')); //清空首頁使用的RTK搜尋條件 setSingleFilter
      return;
    } else if (searchValue !== '') {
      //首頁若有搜尋則帶出搜尋結果
      let result = [...allProducts];
      //「讀取RTK：首頁輸入的關鍵字」-> 根據關鍵字搜尋產品
      result = result.filter((product) => product.title.includes(searchValue));
      dispatch(setFilterProducts(result)); //帶入搜尋結果，渲染UI
      dispatch(setSearchValue('')); //清空首頁使用的RTK搜尋欄位 searchValue
      return;
    } else {
      // 若皆無則進行篩選初始化，預設篩選條件顯示全部產品
      let result = [...allProducts];
      result = result.filter((product) =>
        Object.values(filters).every((filter) => filter(product))
      );
      dispatch(setFilterProducts(result));
      return;
    }
  }, [singleFilter, searchValue, allProducts, dispatch, filters]);

  //篩選button：點擊篩選產品主題：新品報到、限時搶購、冠軍排行
  const handleFilterClick = (filterName) => {
    const newFiltersData = {
      ...filtersData,
      [filterName]: !filtersData[filterName], //切換true/false
    };
    setFiltersData(newFiltersData);
    handleFilterProducts();

    //change Name for render path & UI
    if (filterName === 'is_newest' && !filtersData[filterName]) {
      filterName = '新品報到';
    } else if (filterName === 'is_discounted' && !filtersData[filterName]) {
      filterName = '限時搶購';
    } else if (filterName === 'is_hottest' && !filtersData[filterName]) {
      filterName = '冠軍排行';
    } else {
      filterName = filtersData.category;
    }

    navigate(`/productList/search/${filtersData.category}`);
  };

  //篩選button：點擊切換產品分類：全部、智能戶外系列、質感室內系列
  //const [category, setCategory] = useState('全部')
  const handleCategoryClick = (categoryName) => {
    setFiltersData({
      ...filtersData,
      category: categoryName,
    });
    handleFilterProducts();
    if (categoryName === '全部') {
      navigate(`/productList/all`);
    } else {
      navigate(`/productList/search/${categoryName}`);
    }
  };

  //取得所有產品
  const getAllProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products/all`);
      const allProducts = res.data.products;
      dispatch(setAllProducts(allProducts));
    } catch (error) {
      dispatch(
        pushMessage({
          title: '產品資料取得失敗',
          text: error.response.data.message,
          type: 'danger',
        })
      );
    }
  };

  // 初始化顯示資料：預設執行顯示篩選結果(預設篩選條件為全部)
  // 當篩選條件變更時，重新執行篩選取結果
  useEffect(() => {
    if (allProducts.length === 0) {
      getAllProducts();
    }
    handleFilterProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts, filtersData]);

  // 點選 header nav、breadcrumb 的產品列表時
  // 強制切換分類為全部、並取消所有篩選分類
  useEffect(() => {
    if (location.pathname.includes('/productList/all')) {
      setFiltersData(filterDefault);
    }
  }, [location.pathname, filterDefault, navigate]);

  // 若在搜尋結果頁面執行重新整理，則自動導回全部產品列表頁
  useEffect(() => {
    // 執行首頁關鍵字搜尋、首頁分類查看更多產品時，不往下執行，避免誤判導致自動導向
    if (singleFilter !== '' || searchValue !== '') {
      return;
    }
    const isReload = performance.getEntriesByType('navigation')[0]?.type === 'reload';
    if (isReload && location.pathname.includes('/productList/search')) {
      navigate('/productList/all', { replace: true });
      setFiltersData(filterDefault);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 來自產品詳細頁 productDetail.jsx 的 breadcrumb，選擇產品分類的邏輯處理
  useEffect(() => {
    if (location.state?.from === 'ProductDetailPage') {
      handleCategoryClick(params.search);
    }
    if (location.state?.from === 'allPagesSearch') {
      setFiltersData(filterDefault);
      let result = [...allProducts];
      result = result.filter((product) => product.title.includes(searchValue));
      dispatch(setFilterProducts(result));
      //dispatch(setSearchValue(''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
    <>
      <section className="productListPage">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          spaceBetween={0} // 幻燈片之間的間距
          slidesPerView={1} // 一次顯示幾張
          //navigation // 左右箭頭
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="swiperBanner"
          loop={bannerImgs.length >= 2}
        >
          {bannerImgs.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="container detail text-center">
                <p className={isMobile ? 'h4' : 'h2'}>{img.title}</p>
                <p className={isMobile ? 'h6 mobileMaxWidth' : 'h4'}>{img.content}</p>
              </div>
              <img src={isMobile ? img.md : img.lg} alt={img.title} className="w-100" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="container pb-5">
          <div className="breadcrumb">
            <Link className="breadLink" to="/">
              首頁
              <span className="material-icons-outlined"></span>
            </Link>
            <Link className="breadLink" to="/productList/all">
              智能產品
              <span className="material-icons-outlined"></span>
            </Link>
            <span className="breadLink">{filtersData.category}</span>
          </div>
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className={`searchBar ${searchText ? 'active' : ''}`}>
                <input
                  type="search"
                  placeholder="季節主打商品熱賣中"
                  value={searchText}
                  className="input px-3"
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleFilterKeywordProducts}
                >
                  <span className="material-icons-outlined fs-5 align-self-center">
                    arrow_forward
                  </span>
                </button>
              </div>
              <div className="tagList d-flex gap-1 mb-4 mb-md-5 mt-2">
                {tagList.map((tag) => (
                  <button
                    type="text"
                    key={tag}
                    className="badge rounded-pill border-0 textBody3 py-1"
                    onClick={() => {
                      handleTagSearch(tag);
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <h6 className="h6 mb-3 d-none d-md-block">產品分類</h6>
              <div className="categoryNavRWD">
                <ul className="categoryNav">
                  <li>
                    <button
                      type="button"
                      className={`btn categoryBtn ${filtersData.category === '全部' ? 'active' : ''}`}
                      onClick={() => handleCategoryClick('全部')}
                    >
                      <span className="material-icons">list</span>全部產品
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`btn categoryBtn ${filtersData.category === '智能戶外系列' ? 'active' : ''}`}
                      onClick={() => handleCategoryClick('智能戶外系列')}
                    >
                      <span className="material-icons">light_mode</span>智能戶外
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`btn categoryBtn ${filtersData.category === '質感室內系列' ? 'active' : ''}`}
                      onClick={() => handleCategoryClick('質感室內系列')}
                    >
                      <span className="material-icons">home</span>質感室內
                    </button>
                  </li>
                </ul>
              </div>
              <h6 className="h6 mb-1 mb-md-3">主題篩選</h6>
              <div className="categoryNavRWD">
                <ul className="categoryNav">
                  <li>
                    <button
                      type="button"
                      className={`btn categoryBtn ${filtersData.is_newest || params.search === '新品報到' ? 'active' : ''}`}
                      onClick={() => handleFilterClick('is_newest')}
                    >
                      <span className="material-icons">verified</span>新品報到
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`btn categoryBtn ${filtersData.is_hottest || params.search === '冠軍排行' ? 'active' : ''}`}
                      onClick={() => handleFilterClick('is_hottest')}
                    >
                      <span className="material-icons">local_fire_department</span>冠軍排行
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`btn categoryBtn ${filtersData.is_discounted || params.search === '限時搶購' ? 'active' : ''}`}
                      onClick={() => handleFilterClick('is_discounted')}
                    >
                      <span className="material-icons">timer</span>限時搶購
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
  );
};
export default ProductLayout;
