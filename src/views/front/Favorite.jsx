import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import useScreenSize from "../../hooks/useScreenSize";
import productInfoData from "../../data/productInfoData";
import { ToastAlert } from '../../utils/sweetAlert';
import ReactLoading from "react-loading";
import { setAllProducts } from "../../redux/productSlice";
import ProductCard from "../../component/ProductCard";
import { Link } from "react-router-dom";


const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const Favorite = () => {
    //RWD:自訂hook
    const { screenWidth } = useScreenSize();
    const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false
    //RTK取得：完整產品列表、加入收藏ID列表、收藏清單
    const allProducts = useSelector(state => state.product.allProducts)
    const favoriteList = useSelector(state => state.favorite.favoriteList);
    const favoriteProducts = allProducts.filter( product => favoriteList[product.id])

    //全螢幕Loading
    const [isScreenLoading, setIsScreenLoading] = useState(false); 

    //取得產品資料
    const dispatch = useDispatch();
    const getAllProducts = useCallback(async () => {
        setIsScreenLoading(true)
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products/all`);
            const { products } = res.data;
            dispatch(setAllProducts(products))
        } catch (error) {
            ToastAlert.fire({
                icon: "error",
                title: "取得產品失敗",
                text: error
            });
        } finally {
            setIsScreenLoading(false)
        }
    },[dispatch]);

    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);
    

    return (
        <div className="favoritePage">
            <div className="mb-5">
                <h1 className={`${isMobile ? 'h4' : 'h3'}  mt-0 text-primary`}>{productInfoData['加入收藏'].title}</h1>
                <div className={isMobile ? 'textBody2' : 'textBody1'}>
                    <div dangerouslySetInnerHTML={{ __html: productInfoData['加入收藏'].content }} />
                </div>
            </div>
            {favoriteProducts.length === 0 &&
                <p className="textBody2 text-secondary">
                    還沒有收藏任何商品喔！趕快去逛逛吧！！<br/>
                    <Link to='/productList/all' className='btn btn-primary mt-2'>找找智能商品</Link>
                </p>
            }
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3">
                {favoriteProducts?.map((product) => (
                    <div className="col mb-5" key={product.id}>
                        <ProductCard product={product} />
                    </div>
                ))}
                
            </div>
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
        </div>
    )
}
export default Favorite;