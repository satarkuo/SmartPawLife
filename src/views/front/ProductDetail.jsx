import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactLoading from "react-loading";
import { ToastAlert } from '../../utils/sweetAlert';
import { useDispatch, useSelector } from "react-redux";
import { updateCartData } from "../../redux/cartSlice";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Thumbs } from 'swiper/modules';
import { toggleFavoriteList } from "../../redux/favoriteListSlice";


const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const ProductDetail = () => {
    const dispatch = useDispatch({});
    //RTK取得：收藏清單狀態 
    const favoriteList = useSelector(state => state.favorite.favoriteList)
    // toggle favorite
    const toggleFavorite = (e,id) => {
        e.preventDefault(); // 取消 a 連結
        e.stopPropagation(); // 取消觸發 <Link> 導航行為
        dispatch(toggleFavoriteList(id));
    }

    //Loading邏輯
    const [isScreenLoading, setIsScreenLoading] = useState(false); //全螢幕Loading
    const [isLoading, setIsLoading] = useState(false); //局部loading
    

    //產品資料
    const [tempProduct, setTempProduct] = useState({}); //單一產品介紹
    const [qtySelect, setQtySelect] = useState(1); //加入購物車：產品數量
    const defaultColor = {
        colorName: '',
        colorCode: ''
    }
    const [selectedColor,setSelectedColor] = useState(defaultColor); //加入購物車：產品顏色
    const {id: product_id} = useParams();

    //取得產品資料
    const getProduct = async () => {
        setIsScreenLoading(true)
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/product/${product_id}`);
            setTempProduct(res.data.product);
        } catch (error) {
            ToastAlert.fire({
                icon: "error",
                title: "取得產品失敗",
                text: error
            });
        } finally {
            setIsScreenLoading(false)
        }
    }

    useEffect(() => {
        getProduct();
    }, []);

    // 加入購物車、直接購買
    const navigate = useNavigate();
    const addCardItem = async(product_id, qty, color, mode) => {
        if (selectedColor.colorName === '') {
            ToastAlert.fire({
                icon: "error",
                title: "請先選擇顏色",
            });
            return
        }
        //mode：加入購物車shopping、直接購買checkout
        mode === 'shopping'? setIsLoading(true) : setIsScreenLoading(true);
        const data = {product_id, qty:Number(qty), color};
        try {
            await axios.post(`${BASE_URL}/api/${API_PATH}/cart`, {data});
            getCartList();
            ToastAlert.fire({
                icon: "success",
                title: '產品已加入購物車'
            });
            if(mode === 'checkout') {
                navigate('/cart');
                window.scrollTo(0, 0);
                return
            }
            
        } catch (error) {
            ToastAlert.fire({
                icon: "error",
                title: "加入購物車失敗",
                text: error
            });
        } finally {
            //mode：加入購物車shopping、直接購買checkout
            mode === 'shopping'? setIsLoading(false) : setIsScreenLoading(false);
        }
    }

    //取得購物車資料，更新header購物車數量
    const getCartList = async() => {
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
            dispatch(updateCartData(res.data.data))
        } catch (error) {
            ToastAlert.fire({
                icon: "error",
                title: "取得購物車失敗",
                text: error
            });
        }
    }
    //Swiper 產品圖
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    
    return (<>
        <section className="productDetail py-2 py-md-5 mb-5">
            <div className="container">
                <div className="breadcrumb">
                    <Link className="breadLink" to='/'>
                        首頁
                        <span className="material-icons-outlined"></span>
                    </Link>
                    <Link className="breadLink" to='/productList'>
                        智能產品
                        <span className="material-icons-outlined"></span>
                    </Link>
                    <Link className="breadLink" to={`/productList/${tempProduct.category}`}>
                        {tempProduct.category}
                        <span className="material-icons-outlined"></span>
                    </Link>
                    <span className="breadLink">{tempProduct.title}</span>
                </div>
                <div className="d-flex flex-column flex-md-row gap-4">
                    <div className="">
                        <div className='productDetail-gallery'>
                        <span className={`material-icons favoriteBtn ${favoriteList[tempProduct.id] && 'active'}`}
                            onClick={(e) => toggleFavorite(e, tempProduct.id)}></span>
                            <Swiper
                                style={{
                                '--swiper-navigation-color': '#fff',
                                '--swiper-pagination-color': '#fff',
                                }}
                                spaceBetween={0}
                                navigation={true}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className='main-swiper rounded-3'
                                //className="mySwiper2"
                            >
                                <SwiperSlide>
                                    <img src={tempProduct.imageUrl} className="main-image rounded-3" alt={tempProduct.title}/>
                                </SwiperSlide>
                                {tempProduct?.imagesUrl?.map(img => (
                                    <SwiperSlide key={img}>
                                        <img src={img} className="main-image rounded-3" alt={tempProduct.title}/>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={24}
                                slidesPerView={3}
                                watchSlidesProgress={true}
                                modules={[Navigation, Thumbs]}
                                className="thumbs-swiper"
                                breakpoints={{
                                    1400: {
                                        slidesPerView: 3,
                                    },
                                    0: {
                                        slidesPerView: 3,
                                    },
                                }}
                                //About.jsxstyle={{width: '80px'}}
                            >
                                <SwiperSlide >
                                    <img src={tempProduct.imageUrl} className="thumb-image rounded-3" alt={tempProduct.title}/>
                                </SwiperSlide>
                                {tempProduct?.imagesUrl?.map(img => (
                                    <SwiperSlide key={img}>
                                        <img src={img} className="thumb-image rounded-3" alt={tempProduct.title}/>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                    <div className="d-flex flex-fill flex-column gap-3 gap-md-4">
                        <div>
                            <div className="d-flex gap-2 gap-lg-4 flex-lg-row flex-column align-content-center">
                                <h1 className="h5 m-0 lh-1">{tempProduct.title}</h1>
                                <div className="tagBox">
                                    {tempProduct.is_newest && 
                                        <span className="tag textBody3 bg-info">
                                            <span className="material-icons textBody2">verified</span>
                                            新品
                                        </span>
                                    }
                                    {tempProduct.is_hottest && 
                                        <span className="tag textBody3">
                                            <span className="material-icons textBody2">local_fire_department</span>
                                            TOP
                                        </span>
                                    }
                                    {tempProduct.origin_price > tempProduct.price && 
                                        <span className="tag textBody3 bg-primary">
                                            <span className="material-icons textBody2">timer</span>
                                            限時優惠
                                        </span>
                                    }
                                </div>
                            </div>
                            <p className="textBody3 text-secondary mt-2">{tempProduct.description}</p>
                        </div>
                        <p>
                            <span className="h4 text-primary">$ {(tempProduct.price || 0).toLocaleString()}</span>
                            { tempProduct.origin_price > tempProduct.price && 
                                <del className="textBody3 text-secondary ms-3">$ {(tempProduct.origin_price || 0).toLocaleString()}</del>}
                        </p>
                        <div className='d-flex'>
                            <div className='form-label mb-0 d-flex align-items-center' style={{'width':'60px'}}>顏色</div>
                            {tempProduct?.color?.map((color,index) => {
                                return(<div className='form-check ps-0 me-3 checkedStyle' key={color.colorName}>
                                    <input type='radio' id={`color-${index+1}`}
                                        value={color.colorName} name='color' 
                                        className='form-check-input d-none'
                                        onChange={() => setSelectedColor({colorName: color.colorName, colorCode: color.colorCode})}
                                        checked={color.colorName === selectedColor.colorName}
                                        />
                                    <label className='form-check-label' htmlFor={`color-${index+1}`}>
                                        <div className="d-flex flex-column">
                                            <span className="colorSquare" style={{'backgroundColor': color.colorCode }}></span>
                                            <small style={{'color': color.colorName === selectedColor.colorName ? '#423A2F' : '#7F7A7A' }}>{color.colorName}</small>
                                        </div>
                                    </label>
                                </div>)
                            })}
                        </div>
                        
                        <div className="input-group qtySelectBox">
                            <label htmlFor="qtySelect" style={{'width':'60px'}}>數量</label>
                            <div className="d-flex flex-fill align-items-center">
                                <button
                                    type="button"
                                    className="btn btn-primary-outline btn-increase"
                                    disabled={qtySelect <= 1}
                                    onClick={()=> setQtySelect(qtySelect-1)}
                                >
                                    <span className="material-icons align-content-center fs-4">remove</span>
                                </button>
                                <span className="qtyValue w-md-100">{qtySelect}</span>
                                <button
                                    type="button"
                                    className="btn btn-primary-outline btn-decrease"
                                    disabled={qtySelect >= 10}
                                    onClick={()=> setQtySelect(qtySelect+1)}
                                >
                                    <span className="material-icons align-content-center fs-4">add</span>     
                                </button>
                            </div>
                        </div>
                        <hr />
                        <div className="d-flex gap-md-4 gap-3">
                            <button type="button" disabled={isLoading} 
                                className="btn btn-primary-outline flex-fill d-flex align-items-center justify-content-center gap-2" 
                                onClick={() => addCardItem(tempProduct.id, qtySelect, selectedColor, 'checkout')}>
                                直接購買
                                {isLoading && (
                                    <ReactLoading type={"spin"} color={"#000"} height={"1.2rem"} width={"1.2rem"} />
                                )}
                            </button>
                            <button type="button" disabled={isLoading}
                                className="btn btn-primary flex-fill d-flex align-items-center justify-content-center gap-2"
                                onClick={() => addCardItem(tempProduct.id, qtySelect, selectedColor, 'shopping')}>
                                加入購物車
                                {isLoading && (
                                    <ReactLoading type={"spin"} color={"#000"} height={"1.2rem"} width={"1.2rem"} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="tabBox">
                    <ul className="nav nav-pills mb-4" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="pills-content-tab" data-bs-toggle="pill" data-bs-target="#pills-content" type="button" role="tab" aria-controls="pills-content" aria-selected="true">產品說明</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-notice-tab" data-bs-toggle="pill" data-bs-target="#pills-notice" type="button" role="tab" aria-controls="pills-notice" aria-selected="false">注意事項</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-spec-tab" data-bs-toggle="pill" data-bs-target="#pills-spec" type="button" role="tab" aria-controls="pills-spec" aria-selected="false">產品規格</button>
                        </li>
                    </ul>
                    <div className="tab-content contentBox mb-3" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-content" role="tabpanel" aria-labelledby="pills-content-tab">
                            {/* 將內容直接渲染為HTML，注意：若資料來自外部並不安全，建議增加使用 dompurify 以避免XSS攻擊*/}
                            <div dangerouslySetInnerHTML={{ __html: tempProduct.content }} />
                        </div>
                        <div className="tab-pane fade" id="pills-notice" role="tabpanel" aria-labelledby="pills-notice-tab">
                            <div dangerouslySetInnerHTML={{ __html: tempProduct.notice }} />
                        </div>
                        <div className="tab-pane fade" id="pills-spec" role="tabpanel" aria-labelledby="pills-spec-tab">
                            <table className="table specTable">
                                <tbody>
                                    <tr>
                                        <th width='60px'>材質</th>
                                        <td>{tempProduct.material}</td>
                                    </tr>
                                    <tr>
                                        <th>尺寸</th>
                                        <td>{tempProduct.size}</td>
                                    </tr>
                                    <tr>
                                        <th>顏色</th>
                                        <td>
                                            {tempProduct?.color?.map((color, index) => (
                                                <span key={index}>{color.colorName} {index+1 === tempProduct.color.length ? '' : '、' }</span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>產地</th>
                                        <td>{tempProduct.origin}</td>
                                    </tr>
                                    <tr>
                                        <th>保固</th>
                                        <td>{tempProduct.warranty}</td>
                                    </tr>
                                </tbody>
                            </table>
                            
                        </div>
                    </div>
                </div>
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
    </>)
}
export default ProductDetail;