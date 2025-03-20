import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar, Autoplay,FreeMode, Thumbs } from 'swiper/modules';

import { useDispatch, useSelector } from 'react-redux';
import { pushMessage } from "../../redux/toastSlice";
import { Link, useNavigate } from 'react-router-dom';
import { ToastAlert } from '../../utils/sweetAlert';
import useScreenSize from '../../hooks/useScreenSize';
import swiperBannerImages from '../../data/swiperBannerImages';
import { setSearchValue, setSingleFilter } from '../../redux/searchSlice';
import { setAllProducts } from '../../redux/productSlice';
import ProductCard from '../../component/ProductCard';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const Home = () => {

    //swiper RWD:自訂hook
    const { screenWidth } = useScreenSize();
    const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false
    
    //swiper 播放邏輯：暫停與恢復
    const swiperRef = useRef(null);
    const pauseSwiper = () => swiperRef.current?.autoplay.stop(); //暫停
    const resumeSwiper = () => swiperRef.current?.autoplay.start(); //恢復

    //取得商品資料
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cheaperProducts, setCheaperProducts] = useState([]); //限時優惠商品list
    const [hottestProduct, setHottestProduct] = useState({}); //單筆-最熱門商品
    const [newestProduct, setNewestProduct] = useState({}); //單筆-最新商品

    useEffect(() => {
        getAllProducts();
    },[])

    const getAllProducts = async() => {
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products/all`);
            const allProducts = res.data.products;
            const cheaper = res.data.products.filter(item => item.origin_price > item.price)
            const hottest = res.data.products.find(item => item.is_hottest === true)
            const newest = res.data.products
                            .filter(item=> item.id !== hottest.id) //讓最新商品與熱門商品不重複
                            .find(item => item.is_newest === true)
            dispatch(setAllProducts(allProducts))
            setCheaperProducts(cheaper)
            setHottestProduct(hottest)
            setNewestProduct(newest)
        } catch (error) {
            dispatch(pushMessage({
                title: '產品資料取得失敗',
                text: error.response.data.message,
                type: 'danger'
            }))
        }
    }

    //Swiper 產品圖：熱門產品、新品
    const [hottestThumbsSwiper, setHottestThumbsSwiper] = useState(null);
    const [newestThumbsSwiper, setNewestThumbsSwiper] = useState(null);

    //RTK取得：搜尋關鍵字
    const searchValue = useSelector(state => state.search.searchValue)

    //Swiper Banner input:儲存關鍵字
    const handleInputChange = (e) => {
        const { value } = e.target;
        dispatch(setSearchValue(value));
    }

    //Swiper Banner 送出搜尋
    const handleFilterProducts = () => {
            if (searchValue !== '') {
                navigate(`/productList/search/${searchValue}`)
            } else {
                ToastAlert.fire({
                    icon: "error",
                    title: "請先輸入搜尋關鍵字"
                });
            }
    }
    //button: 送出搜尋
    const handleButtonFilterProducts = (filterName) => {
        dispatch(setSingleFilter(filterName))
        //change Name for render UI
        if (filterName ==='is_newest'){ 
            filterName = '新品報到'
        } else if (filterName ==='is_discounted' ) { 
            filterName = '限時搶購'
        } else if (filterName ==='is_hottest' ) { 
            filterName = '冠軍排行'
        } 
        navigate(`/productList/search/${filterName}`)
    }

    return (<section className='homePage'>
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            spaceBetween={0} // 幻燈片之間的間距
            slidesPerView={1} // 一次顯示幾張
            //navigation // 左右箭頭
            onSwiper={swiper => swiperRef.current = swiper}
            onMouseEnter={pauseSwiper}
            onMouseLeave={resumeSwiper}
            pagination={{ clickable: true }} // 分頁點
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className='swiperBanner'
            loop={swiperBannerImages.length >= 2}
            >
            {swiperBannerImages.map((img,i) => (
                <SwiperSlide key={i}>
                    <div className='container detail'>
                        <div className='mainTitle'>
                            <p className={isMobile ? 'h3' : 'h1'}>{img.title}</p>
                            <p className={isMobile ? 'h5' : 'h4'}>{img.content}</p>
                        </div>
                        <div className="searchBar">
                            <input type="search" placeholder="搜尋關鍵字" value={searchValue}
                                className="input px-3"
                                onChange={handleInputChange}
                                onFocus={pauseSwiper}
                                onBlur={resumeSwiper}
                                />
                            <button type="submit" 
                                className="btn btn-primary"
                                onClick={handleFilterProducts}>
                                <span className="material-icons-outlined fs-5 align-self-center">arrow_forward</span>    
                            </button>
                        </div>
                        <div>
                            <Link to='/productList/all' className="btn btn-primary d-inline-flex">
                                立即選購
                                <span className="material-icons ms-1 fs-5 align-self-center">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                    <img src={isMobile ? img.md : img.lg} alt={img.title} className='w-100'/>
                </SwiperSlide>
            ))}
        </Swiper>
        <div className="bg-wave bg-wave1 pb-5" style={{ backgroundColor: 'var(--primaryPestel)'}}>
            <div className="container pb-5 pt-0 pt-md-5">
                <h2 className={`${isMobile ? 'h3' : 'h2'} text-center py-5`}>
                    <span className="titleUnderline"><span>限時優惠</span></span>
                </h2>
                <Swiper
                    className="discountSwiper"
                    modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                    spaceBetween={24} // 幻燈片之間的間距
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop={cheaperProducts.length >= 10}
                    breakpoints={{ // N px 以上 一次顯示幾張
                        640: { slidesPerView: 2 },  
                        768: { slidesPerView: 3 },  
                        1024: { slidesPerView: 4 }, 
                        1440: { slidesPerView: 5 }
                    }}
                    >
                    {cheaperProducts?.map((product) => (
                        <SwiperSlide className="mb-5" key={product.id}>
                            <ProductCard product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className='text-end'>
                    <button type="text" 
                        className="btn btn-primary d-inline-flex"
                        onClick={() => handleButtonFilterProducts('is_discounted')}>
                        立即選購
                        <span className="material-icons ms-1 fs-5 align-self-center">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
        {hottestProduct?.imagesUrl?.length >= 1 && (
            <div className="bg-wave bg-wave2 pt-5">
                <div className="container pb-5 pt-0 pt-md-5">
                    <h2 className={`${isMobile ? 'h3' : 'h2'} text-center py-5`}>
                        <span className="titleUnderline"><span>熱門產品</span></span>
                    </h2>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className='product-gallery'>
                                <Swiper
                                    style={{
                                    '--swiper-navigation-color': '#fff',
                                    '--swiper-pagination-color': '#fff',
                                    }}
                                    spaceBetween={0}
                                    navigation={true}
                                    thumbs={{ swiper: hottestThumbsSwiper }}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className='main-swiper rounded-3'
                                    //className="mySwiper2"
                                >
                                    <SwiperSlide>
                                        <img src={hottestProduct.imageUrl} className="main-image rounded-3" alt={hottestProduct.title}/>
                                    </SwiperSlide>
                                    {hottestProduct.imagesUrl.map(img => (
                                        <SwiperSlide key={img}>
                                            <img src={img} className="main-image rounded-3" alt={hottestProduct.title}/>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <Swiper
                                    onSwiper={setHottestThumbsSwiper}
                                    
                                    slidesPerView={3}
                                    watchSlidesProgress={true}
                                    modules={[Navigation, Thumbs]}
                                    className="thumbs-swiper"
                                    breakpoints={{
                                        1400: {
                                            direction: "vertical", // 桌機版: 右側垂直排列
                                            slidesPerView: 3,
                                            spaceBetween: 24
                                        },
                                        0: {
                                            direction: "horizontal", // 手機版: 下方水平排列
                                            slidesPerView: 3,
                                            spaceBetween: 12
                                        },
                                    }}
                                >
                                    <SwiperSlide >
                                        <img src={hottestProduct.imageUrl} className="thumb-image rounded-3" alt={hottestProduct.title}/>
                                    </SwiperSlide>
                                    {hottestProduct.imagesUrl.map(img => (
                                        <SwiperSlide key={img}>
                                            <img src={img} className="thumb-image rounded-3" alt={hottestProduct.title}/>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                        <div className='col-md-6 p-2 py-4 ps-md-4 ps-lg-5 d-flex flex-column justify-content-center gap-2 gap-md-4 gap-lg-5'>
                            <div>
                                <h2 className={`${isMobile ? 'h4' : 'h2'} text-primary`}>{hottestProduct.title}</h2>
                                <p className={isMobile ? 'h4' : 'h2'}>{hottestProduct.description}</p>
                            </div>
                            <div className={isMobile ? 'textBody3' : 'textBody1'}>
                                <div dangerouslySetInnerHTML={{ __html: hottestProduct.content }} />
                            </div>
                            <div className='text-end'>
                                <button type="text" 
                                    className="btn btn-primary-outline d-flex d-md-inline-flex justify-content-center"
                                    onClick={() => handleButtonFilterProducts('is_hottest')}>
                                    更多熱門
                                    <span className="material-icons ms-1 fs-5 align-self-center">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        {newestProduct?.imagesUrl?.length >= 1 && (
            <div className="pb-5">
                <div className="container pb-5 pt-0 pt-md-5">
                    <h2 className={`${isMobile ? 'h3' : 'h2'} text-center py-5`}>
                        <span className="titleUnderline"><span>最新產品</span></span>
                    </h2>
                    <div className='row flex-row-reverse flex-md-row'>
                        
                        <div className='col-md-6 order-md-last'>
                            <div className='product-gallery'>
                                <Swiper
                                    style={{
                                    '--swiper-navigation-color': '#fff',
                                    '--swiper-pagination-color': '#fff',
                                    }}
                                    spaceBetween={0}
                                    navigation={true}
                                    thumbs={{ swiper: newestThumbsSwiper }}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className='main-swiper rounded-3'
                                    //className="mySwiper2"
                                >
                                    <SwiperSlide>
                                        <img src={newestProduct.imageUrl} className="main-image rounded-3" alt={newestProduct.title}/>
                                    </SwiperSlide>
                                    {newestProduct.imagesUrl.map(img => (
                                        <SwiperSlide key={img}>
                                            <img src={img} className="main-image rounded-3" alt={newestProduct.title}/>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <Swiper
                                    onSwiper={setNewestThumbsSwiper}
                                    slidesPerView={3}
                                    watchSlidesProgress={true}
                                    modules={[Navigation, Thumbs]}
                                    className="thumbs-swiper"
                                    breakpoints={{
                                        1400: {
                                            direction: "vertical", // 桌機版: 右側垂直排列
                                            slidesPerView: 3,
                                            spaceBetween: 24
                                        },
                                        0: {
                                            direction: "horizontal", // 手機版: 下方水平排列
                                            slidesPerView: 3,
                                            spaceBetween: 12
                                        },
                                    }}
                                >
                                    <SwiperSlide >
                                        <img src={newestProduct.imageUrl} className="thumb-image rounded-3" alt={newestProduct.title}/>
                                    </SwiperSlide>
                                    {newestProduct.imagesUrl.map(img => (
                                        <SwiperSlide key={img}>
                                            <img src={img} className="thumb-image rounded-3" alt={newestProduct.title}/>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                        <div className='col-md-6 p-2 py-4 pe-md-4 pe-lg-5 d-flex flex-column justify-content-center gap-2 gap-md-4 gap-lg-5'>
                            <div>
                                <h2 className={`${isMobile ? 'h4' : 'h2'} text-primary`}>{newestProduct.title}</h2>
                                <p className={isMobile ? 'h4' : 'h2'}>{newestProduct.description}</p>
                            </div>
                            <div className={isMobile ? 'textBody3' : 'textBody1'}>
                                <div dangerouslySetInnerHTML={{ __html: newestProduct.content }} />
                            </div>
                            <div className='text-end'>
                                <button type="text" 
                                    className="btn btn-primary-outline d-flex d-md-inline-flex justify-content-center"
                                    onClick={() => handleButtonFilterProducts('is_newest')}>
                                    更多新品
                                    <span className="material-icons ms-1 fs-5 align-self-center">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
    </section>)
}
export default Home;