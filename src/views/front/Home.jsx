import { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';

import { useDispatch } from 'react-redux';
import { pushMessage } from "../../redux/toastSlice";
import { Link } from 'react-router-dom';
import useScreenSize from '../../hooks/useScreenSize';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const swiperImages = [ 
    {
        lg: '/src/assets/img/banner/banner1-lg.png',
        md: '/src/assets/img/banner/banner1-md.png',
        title: '讓科技寵愛你的寵物生活',
        content: '專為毛孩打造的智能用品，讓每一天更輕鬆、更快樂'
    },
    {
        lg: '/src/assets/img/banner/banner2-lg.png',
        md: '/src/assets/img/banner/banner2-md.png',
        title: '讓科技寵愛你的寵物生活',
        content: '專為毛孩打造的智能用品，讓每一天更輕鬆、更快樂'
    },
    {
        lg: '/src/assets/img/banner/banner3-lg.png',
        md: '/src/assets/img/banner/banner3-md.png',
        title: '讓科技寵愛你的寵物生活',
        content: '專為毛孩打造的智能用品，讓每一天更輕鬆、更快樂'
    },
]

const Home = () => {

    //swiper RWD:自訂hook
    const { screenWidth } = useScreenSize();
    const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false

    //限時優惠產品
    const dispatch = useDispatch();
    const [cheaperProducts, setCheaperProducts] = useState([]);

    useEffect(() => {
        getAllProducts();
    },[])

    const getAllProducts = async() => {
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products/all`);
            const cheaper = res.data.products.filter(item => item.origin_price > item.price)
            setCheaperProducts(cheaper)
        } catch (error) {
            dispatch(pushMessage({
                title: '產品資料取得失敗',
                text: error.response.data.message,
                type: 'danger'
            }))
        }
    }

    return (<div className='homePage'>
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            spaceBetween={0} // 幻燈片之間的間距
            slidesPerView={1} // 一次顯示幾張
            //navigation // 左右箭頭
            pagination={{ clickable: true }} // 分頁點
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className='swiperBanner'
            loop={swiperImages.length >= 2}
            >
            {swiperImages.map((img,i) => (
                <SwiperSlide key={i}>
                    <div className='container detail'>
                        <p className='h1'>{img.title}</p>
                        <p className='h4'>{img.content}</p>
                        <div>
                            <Link to='/productList' className="btn btn-primary d-inline-flex">
                                立即選購
                                <span className="material-icons ms-1 fs-5 ">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                    <img src={isMobile ? img.md : img.lg} alt={img.title} className='w-100'/>
                </SwiperSlide>
            ))}
        </Swiper>
        <div className="bg-wave bg-wave1 pb-5" style={{ backgroundColor: 'var(--primaryPestel)'}}>
            <div className="container py-5">
                <h2 className='h2 text-center py-5'>
                    <span className="titleUnderline"><span>限時優惠</span></span>
                </h2>
                <Swiper
                    className="swiperRWD"
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
                            <Link to={`/productList/${product.id}`} 
                                onClick={() => window.scrollTo(0, 0)}
                                className="cardLink h-100 w-100">
                                <div className="card rounded-3 h-100 overflow-hidden border-0" >
                                    <img className="img-fluid round-top"
                                        src={product.imageUrl}
                                        alt={product.title}
                                    />
                                    <div className="card-body">
                                        <p className="card-title h5">{product.title}</p>
                                        <p className="card-text textBody2 text-body-tertiary " 
                                            style={{height: '50px'}}>
                                            {product.description}
                                        </p>
                                    </div>
                                    <div className="card-footer bg-white border-0 d-flex justify-content-between">
                                        <div className="h5 text-primary m-0">$ {product.price.toLocaleString()}</div>
                                        { product.origin_price > product.price && 
                                            <del className="text-body-tertiary align-self-center">$ {product.origin_price.toLocaleString()}</del>}
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className='text-end'>
                    <Link to='/productList' className="btn btn-primary d-inline-flex">
                        立即選購
                        <span className="material-icons ms-1 fs-5 ">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
        <div className="bg-wave bg-wave2 py-5">
            <div className="container py-5">
                <h2 className='h2 text-center py-5'>
                    <span className="titleUnderline"><span>熱門產品</span></span>
                </h2>
            </div>
        </div>
    </div>)
}
export default Home;