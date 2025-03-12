import { useEffect, useState } from "react";
import axios from "axios";
import { ToastAlert } from '../../utils/sweetAlert';
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";

import Pagination from '../../component/Pagination';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const ProductList = () => {
    const [products, setProducts] = useState([]); //產品list
    const [isScreenLoading, setIsScreenLoading] = useState(false); //全螢幕Loading
    //頁碼邏輯
    const [pageInfo, setPageInfo] = useState({});
    const handlePageChange = page => {
        getProducts(page);
        window.scrollTo(0, 0);
    }

    //取得產品資料
    const getProducts = async (page=1) => {
        setIsScreenLoading(true)
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products?page=${page}`);
            setProducts(res.data.products);
            setPageInfo(res.data.pagination)
        } catch (error) {
            ToastAlert.fire({
                icon: "error",
                title: "取得產品失敗",
                text: error
            });
        } finally {
            setIsScreenLoading(false)
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <>
            <section className="py-5 mb-5">
                <div className="container py-5">
                    <div className="mb-4">
                        <h1 className="h2 mt-0 text-primary">智能戶外，探索無限</h1>
                        <p>無論是遛狗、露營，還是戶外探險，我們的戶外智能產品讓您的寵物安全又快樂。<br/>
                            高科技設計結合耐用材質，為毛孩打造最棒的戶外體驗。</p>
                    </div>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-5">
                        {products?.map((product) => (
                            <div className="col mb-5" key={product.id}>
                                <Link to={`/productList/${product.id}`} 
                                    onClick={() => window.scrollTo(0, 0)}
                                    className="cardLink h-100 w-100">
                                    <div className="card rounded-3 h-100 overflow-hidden shadow border-0" >
                                        <img className="img-fluid round-top"
                                            src={product.imageUrl}
                                            alt={product.title}
                                        />
                                        <div className="card-body">
                                            <p className="card-title h5">{product.title}</p>
                                            <p className="card-text textBody2 text-body-tertiary">{product.description}</p>
                                        </div>
                                        <div className="card-footer bg-white border-0 d-flex justify-content-between">
                                            <div className="h5 text-primary m-0">$ {product.price.toLocaleString()}</div>
                                            { product.origin_price > product.price && 
                                                <del className="text-body-tertiary align-self-center">$ {product.origin_price.toLocaleString()}</del>}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    {pageInfo && <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange}/>}
                </div>
            </section>
            {isScreenLoading && (
                <div
                className="d-flex justify-content-center align-items-center"
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(230,146,112,0.7)",
                    zIndex: 1999,
                    }}>
                    <ReactLoading type="spin" color="#fff" width="4rem" height="4rem" />
                </div>
            )}
        </>
    )
}
export default ProductList;