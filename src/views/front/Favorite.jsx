import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import useScreenSize from '../../hooks/useScreenSize';
import { ToastAlert } from '../../utils/sweetAlert';
import ReactLoading from 'react-loading';
import { setAllProducts } from '../../redux/productSlice';
import ProductCard from '../../component/ProductCard';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';

import banner1Lg from '../../assets/img/banner/favorite/banner1-lg.png';
import banner1Md from '../../assets/img/banner/favorite/banner1-md.png';

const bannerImgs = [
  {
    lg: banner1Lg,
    md: banner1Md,
    title: '收藏專屬心動清單',
    content: '智慧管理購物清單，打造毛孩專屬幸福選品',
  },
];

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const Favorite = () => {
  //RWD:自訂hook
  const { screenWidth } = useScreenSize();
  const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false

  //RTK取得：完整產品列表、加入收藏ID列表、收藏清單
  const allProducts = useSelector((state) => state.product.allProducts);
  const favoriteList = useSelector((state) => state.favorite.favoriteList);
  const favoriteProducts = allProducts.filter((product) => favoriteList[product.id]);

  //全螢幕Loading
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  //取得產品資料
  const dispatch = useDispatch();
  const getAllProducts = useCallback(async () => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products/all`);
      const { products } = res.data;
      dispatch(setAllProducts(products));
    } catch (error) {
      ToastAlert.fire({
        icon: 'error',
        title: '取得產品失敗',
        text: error,
      });
    } finally {
      setIsScreenLoading(false);
    }
  }, [dispatch]);

  //若無產品資料才重新取得
  useEffect(() => {
    if (allProducts.length === 0) {
      getAllProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts]);

  return (
    <section className="favoritePage">
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
              <p className={isMobile ? 'h6' : 'h4'}>{img.content}</p>
            </div>
            <img src={isMobile ? img.md : img.lg} alt={img.title} className="w-100" />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="container pb-5 pt-0 pt-md-5 col-xxl-6 m-auto">
        <h2 className={`${isMobile ? 'h3' : 'h2'} text-center py-5`}>
          <span className="titleUnderline">
            <span>收藏清單</span>
          </span>
        </h2>
        {favoriteProducts.length === 0 && (
          <p className="textBody2 text-secondary text-center">
            還沒有收藏任何商品喔！趕快去逛逛吧！！
            <br />
            <Link to="/productList/all" className="btn btn-primary mt-4">
              逛逛智能商品
            </Link>
          </p>
        )}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
          {favoriteProducts?.map((product) => (
            <div className="col mb-5" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {isScreenLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(230,146,112,0.7)',
            zIndex: 1999,
          }}
        >
          <ReactLoading type="spin" color="#fff" width="4rem" height="4rem" />
        </div>
      )}
    </section>
  );
};
export default Favorite;
