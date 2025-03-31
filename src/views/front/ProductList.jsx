import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastAlert } from '../../utils/sweetAlert';
import ReactLoading from 'react-loading';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../../redux/productSlice';
import useScreenSize from '../../hooks/useScreenSize';
import productInfoData from '../../data/productInfoData';

import PaginationBar from '../../component/Pagination';
import ProductCard from '../../component/ProductCard';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const ProductList = () => {
  //RWD:自訂hook
  const { screenWidth } = useScreenSize();
  const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false

  const dispatch = useDispatch();

  //全螢幕Loading
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  //頁碼邏輯
  const [pageInfo, setPageInfo] = useState({});
  const handlePageChange = (page) => {
    getProducts(page);
    window.scrollTo(0, 0);
  };

  //取得產品資料
  const getProducts = async (page = 1) => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products?page=${page}`);
      const { products } = res.data;
      dispatch(setProducts(products));
      setPageInfo(res.data.pagination);
    } catch (error) {
      ToastAlert.fire({
        icon: 'error',
        title: '取得產品失敗',
        text: error,
      });
    } finally {
      setIsScreenLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //RTK取得：搜尋產品列表
  const products = useSelector((state) => state.product.products);

  return (
    <>
      <div className="mb-5">
        <h1 className={`${isMobile ? 'h4' : 'h3'}  mt-0 text-primary`}>
          {productInfoData['全部'].title}
        </h1>
        <div className={isMobile ? 'textBody2' : 'textBody1'}>
          <div dangerouslySetInnerHTML={{ __html: productInfoData['全部'].content }} />
        </div>
      </div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3">
        {products?.map((product) => (
          <div className="col mb-5" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      {pageInfo && <PaginationBar pageInfo={pageInfo} handlePageChange={handlePageChange} />}
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
    </>
  );
};
export default ProductList;
