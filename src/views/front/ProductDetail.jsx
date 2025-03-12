import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactLoading from "react-loading";
import { ToastAlert } from '../../utils/sweetAlert';
import { useDispatch } from "react-redux";
import { updateCartData } from "../../redux/cartSlice";

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const ProductDetail = () => {
    const dispatch = useDispatch({});

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
    };

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
    

    return (<>
        <section className="productDetail py-5 mb-5">
            <div className="container py-5">
                <h1>產品明細</h1>
                <div className="row">
                    <div className="col-md-4">
                        <div className="coverImg">
                            <img
                                src={tempProduct.imageUrl}
                                alt={tempProduct.title}
                                className="w-100 img-fluid rounded-3 mb-3"
                            />
                        </div>
                        <div className="row row-cols-3 mb-5 g-3">
                            {tempProduct?.imagesUrl?.map((img,index) => (
                                <div className="col" key={index}>
                                    {img &&
                                        <img
                                            src={img}
                                            alt={tempProduct.title}
                                            className="w-100 img-fluid rounded-3"
                                        />
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-8">
                        <h1 className="h4">{tempProduct.title}</h1>
                        <p className="text-body-tertiary">{tempProduct.description}</p>
                        <p className="mb-4">
                            <span className="h5 text-primary">$ {(tempProduct.price || 0).toLocaleString()}</span>
                            { tempProduct.origin_price > tempProduct.price && 
                                <del className="text-body-tertiary ms-3">$ {(tempProduct.origin_price || 0).toLocaleString()}</del>}
                        </p>
                        <div className='mb-3 d-flex'>
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
                                            <small className="text-secondary">{color.colorName}</small>
                                        </div>
                                    </label>
                                </div>)
                            })}
                        </div>
                        
                        <div className="input-group align-items-center mb-4">
                            <label htmlFor="qtySelect" style={{'width':'60px'}}>數量</label>
                            <select
                                value={qtySelect}
                                onChange={(e) => setQtySelect(e.target.value)}
                                id="qtySelect"
                                className="form-select d-inline-block rounded-3"
                                style={{'width':'240px', 'flex':'none'}}
                                >
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <option key={index} value={index + 1}>
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="btn-group d-flex" style={{'width':'300px'}}>
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
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
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
                                        <th>材質</th>
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