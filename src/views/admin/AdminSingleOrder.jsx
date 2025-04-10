import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';
import UpdateOrderModal from '../../component/UpdateOrderModal';
import { getPageOrdersData } from '../../redux/admin/adminOrderSlice';

const AdminSingleOrder = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { id: product_id } = params;

  //取得列表儲存的10筆訂單資料
  const orders = useSelector((state) => state.adminOrder.orders);

  //訂單資料
  const [orderData, setOrderData] = useState({}); //單筆訂單
  const [userData, setUserData] = useState({}); //訂購人資料
  const [productsData, setProductsData] = useState([]); //已購買產品
  const [noCouponTotal, setNoCouponTotal] = useState(0); //結算未套用coupon以前的總金額
  const [isChangeData, setIsChangeData] = useState(false); //是否有暫存變更資料，若有則提醒需儲存

  const initOrderData = () => {
    let singleOrder = [];
    // 若重新整理失去RTK orders 資料，則改從localStorage取得
    if (orders.length === 0) {
      const localOrders = JSON.parse(localStorage.getItem('pageOrderData'));
      dispatch(getPageOrdersData(localOrders));
      singleOrder = localOrders[0].filter((item) => item.id === product_id);
    } else {
      singleOrder = orders[0].filter((item) => item.id === product_id);
    }
    const productArray = Object.values(singleOrder[0].products);
    const origin_Total = productArray.reduce((sum, product) => sum + product.total, 0);
    setOrderData(singleOrder[0]);
    setUserData(singleOrder[0].user);
    setProductsData(productArray);
    setNoCouponTotal(origin_Total);
  };

  useEffect(() => {
    initOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //暫存變更：單筆訂單資料
  const handleOrderInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      //若type是checkbox則取得checked的值，否則取得value的值
      [name]: type === 'checkbox' ? checked : value,
    }));
    setIsChangeData(true);
  };

  //暫存變更：訂購人資料
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsChangeData(true);
  };

  //暫存變更：變更產品數量，並重新計算總金額
  const handleProductQtyChange = (id, qty) => {
    //暫存指定id產品數量，並依照該產品有/無優惠券重新計算總金額
    const newProducts = productsData.map((product) =>
      product.id === id
        ? {
            ...product,
            qty: qty,
            total: product.product.price * qty,
            final_total: product.coupon
              ? product.product.price * qty * (product.coupon.percent / 100) // 有優惠券
              : product.product.price * qty, // 沒有優惠券
          }
        : product
    );
    setProductsData(newProducts);
    //暫存折扣前(未使用Coupon)總金額
    const origin_Total = newProducts.reduce((sum, product) => sum + product.total, 0);
    setNoCouponTotal(origin_Total);
    //暫存訂單總金額
    const final_total = newProducts.reduce((sum, product) => sum + product.final_total, 0);
    setOrderData((prevData) => ({
      ...prevData,
      total: final_total,
    }));
    setIsChangeData(true);
  };
  const handleProductDelete = (id) => {
    //filter留下指定id以外的產品
    const newProducts = productsData.filter((product) => product.id !== id);
    setProductsData(newProducts);
    //暫存折扣前(未使用Coupon)總金額
    const origin_Total = newProducts.reduce((sum, product) => sum + product.total, 0);
    setNoCouponTotal(origin_Total);
    //暫存訂單總金額
    const final_total = newProducts.reduce((sum, product) => sum + product.final_total, 0);
    setOrderData((prevData) => ({
      ...prevData,
      total: final_total,
    }));
    setIsChangeData(true);
  };

  //開啟modal：變更訂單確認
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [tempModalData, setTempModalData] = useState({});
  const updateOrder = (order, user, products) => {
    //將產品陣列轉回所需格式、轉為物件型別 products: { 'id1': {...}, 'id2': {...} }
    const productsObj = products.reduce((obj, item) => {
      obj[item.id] = { ...item };
      return obj;
    }, {});

    const data = {
      ...order,
      products: productsObj,
      user,
    };
    setTempModalData(data);
    setIsSaveModalOpen(true);
  };
  return (
    <>
      <section className="position-relative">
        {isChangeData && (
          <div
            className="position-fixed px-4 py-3 bg-danger text-white rounded-4 opacity-75 d-flex align-items-center"
            style={{ top: '1.5rem', right: '1.5rem', width: 'calc(100vw - 3rem - 260px)' }}
          >
            <span className="material-icons-outlined align-content-center me-2 fs-4">info </span>
            提醒您，變更資料尚未儲存！
          </div>
        )}
        <div
          className="p-4 bg-white rounded-4 mb-4"
          style={{ marginTop: isChangeData ? '5rem' : '0' }}
        >
          <div className="d-flex align-items-center mb-4">
            <h1 className="h4 my-0 me-3">訂單管理</h1>
            <Link
              to="/admin/order"
              className="text-primary d-flex align-items-center justify-content-center"
            >
              <span className="material-icons align-content-center fs-6 ">arrow_back_ios</span>
              返回訂單列表
            </Link>
          </div>
          {orderData && (
            <table className="table align-middle adminTable">
              <thead>
                <tr>
                  <th>訂單編號</th>
                  <th>訂購時間</th>
                  <th>付款狀態</th>
                  <th>付款方式</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{orderData.id}</td>
                  <td>{formatDate(orderData.create_at)}</td>
                  <td>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        name="is_paid"
                        id="isPaid"
                        checked={orderData.is_paid || false}
                        disabled={userData?.paymond === '線上刷卡'}
                        onChange={handleOrderInputChange}
                        className="form-check-input"
                      />
                      <label className="form-check-label" htmlFor="isPaid">
                        已付款
                      </label>
                    </div>
                  </td>
                  <td>
                    {userData?.paymond || '匯款轉帳'}
                    {userData?.paymond === '線上刷卡' && (
                      <p className="textBody3 text-secondary m-0">卡號:{userData?.cardNumber}</p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        <div className="row">
          <div className="col-xxl-4 mb-4 mb-xxl-0">
            <div className="p-4 bg-white rounded-4 h-100">
              <h4 className="h4 mb-4">訂購人資料</h4>
              {userData && (
                <table className="table align-middle adminTable">
                  <tbody>
                    <tr>
                      <th width="100px">姓名</th>
                      <td>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={userData.name || ''}
                          onChange={handleUserInputChange}
                          className="form-control"
                          placeholder="請輸入姓名"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>電話</th>
                      <td>
                        <input
                          type="tel"
                          name="tel"
                          id="tel"
                          value={userData.tel || ''}
                          onChange={handleUserInputChange}
                          className="form-control"
                          placeholder="請輸入電話"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>信箱</th>
                      <td>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={userData.email || ''}
                          onChange={handleUserInputChange}
                          className="form-control"
                          placeholder="請輸入信箱"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>地址</th>
                      <td>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={userData.address || ''}
                          onChange={handleUserInputChange}
                          className="form-control"
                          placeholder="請輸入地址"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>留言</th>
                      <td>
                        <textarea
                          id="message"
                          className="form-control"
                          cols="30"
                          rows="5"
                          name="message"
                          onChange={handleOrderInputChange}
                          placeholder="請輸入訂單留言"
                        >
                          {orderData?.message}
                        </textarea>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="col-xxl-8">
            <div className="p-4 bg-white rounded-4 h-100">
              <h4 className="h4 mb-4">訂購產品</h4>
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th width="100">圖示</th>
                    <th>品名</th>
                    <th>顏色</th>
                    <th className="text-end">單價</th>
                    <th className="text-end" style={{ width: '200px' }}>
                      數量/單位
                    </th>
                    <th className="text-end">小計</th>
                    {!orderData?.is_paid && <th width="100"></th>}
                  </tr>
                </thead>
                <tbody>
                  {productsData?.length >= 1 ? (
                    productsData.map((product) => (
                      <tr key={product.id}>
                        <td className="px-0">
                          <img src={product.product.imageUrl} width="80" className="rounded-3" />
                        </td>
                        <td>{product.product.title}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <small className="text-secondary lh-1">{product.color.colorName}</small>
                            <span
                              className="adminColorSquare m-0 ms-2"
                              style={{
                                backgroundColor: product.color.colorCode,
                              }}
                            ></span>
                          </div>
                        </td>
                        <td className="text-end">
                          {product.product.origin_price > product.product.price ? (
                            <del className="textBody3 text-body-tertiary">
                              ${product.product.origin_price.toLocaleString()} <br />
                            </del>
                          ) : (
                            ''
                          )}
                          $ {product.product.price.toLocaleString()}
                        </td>
                        <td className="text-end">
                          {!orderData.is_paid ? (
                            <div className="d-flex justify-content-end align-items-center">
                              <button
                                type="button"
                                className="btn btn-primary-outline btn-sm p-0 ps-2 d-flex align-items-center rounded-end"
                                style={{ width: '32px', height: '32px' }}
                                disabled={product.qty <= 1}
                                onClick={() => handleProductQtyChange(product.id, product.qty - 1)}
                                // onClick={()=> updateCart(product.id, product.product.title, product.qty-1, product.color)}
                              >
                                <span className="material-icons fs-6">remove</span>
                              </button>
                              <span
                                className="text-center border-top border-bottom px-3 py-1"
                                style={{ width: '40px', height: '32px', cursor: 'auto' }}
                              >
                                <b>{product.qty}</b>
                              </span>
                              <button
                                type="button"
                                className="btn btn-primary-outline btn-sm p-0 ps-1 d-flex align-items-center rounded-start"
                                style={{ width: '32px', height: '32px' }}
                                onClick={() => handleProductQtyChange(product.id, product.qty + 1)}
                                //onClick={()=> updateCart(product.id, product.product.title, product.qty+1, product.color)}
                              >
                                <span className="material-icons fs-6">add</span>
                              </button>
                              <span className="input-group-text text-secondary border-0 pe-0">
                                {product.product.unit}
                              </span>
                            </div>
                          ) : (
                            <span className="textBody1">{product.qty}</span>
                          )}
                        </td>
                        <td className="text-end">
                          {product.final_total < product.total ? (
                            <span>
                              <div className="textBody3 text-secondary">
                                {product.coupon.title}
                                <br />
                                {product.coupon.code} | {product.coupon.percent} %
                              </div>
                              <del className="textBody3 text-body-tertiary me-2">
                                $ {product.total.toLocaleString()}{' '}
                              </del>
                              $ {product.final_total.toLocaleString()}
                            </span>
                          ) : (
                            <span>$ {product.total.toLocaleString()} </span>
                          )}
                        </td>
                        {!orderData.is_paid && (
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-primary-outline btn-sm px-2 d-inline-flex"
                              onClick={() => handleProductDelete(product.id)}
                            >
                              <span className="material-icons align-content-center fs-6">
                                clear
                              </span>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-body-tertiary bg-light">
                        沒有任何訂購商品
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div style={{ paddingRight: orderData.is_paid ? '0' : '120px' }}>
                <div className="d-flex align-items-center justify-content-end pb-2">
                  {noCouponTotal ? '總計' : '總金額'}
                  <div className="text-end border-0" style={{ width: '130px' }}>
                    <b className={` ${noCouponTotal ? '' : 'h5 text-primary'} `}>
                      {((noCouponTotal ? noCouponTotal : orderData.total) || 0).toLocaleString()}
                    </b>
                  </div>
                </div>
                {noCouponTotal > orderData.total && (
                  <div>
                    <div className="d-flex align-items-center justify-content-end py-2">
                      折扣
                      <div className="text-end border-0" style={{ width: '130px' }}>
                        <b className="text-danger">
                          -$ {(noCouponTotal - orderData.total).toLocaleString()}
                        </b>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-end py-2">
                      總金額
                      <div className="text-end border-0" style={{ width: '130px' }}>
                        <b className="text-primary h4">$ {orderData.total.toLocaleString()}</b>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-4 mt-4 d-flex">
          <button
            type="submit"
            className="btn btn-primary me-3"
            disabled={isChangeData}
            onClick={() => {
              updateOrder(orderData, userData, productsData);
            }}
          >
            儲存變更
          </button>
          <Link
            to="/admin/order"
            className="text-primary d-flex align-items-center justify-content-center"
          >
            <span className="material-icons align-content-center fs-6 ">arrow_back_ios</span>
            返回訂單列表
          </Link>
        </div>
      </section>
      <UpdateOrderModal
        data={tempModalData}
        setData={setTempModalData}
        isOpen={isSaveModalOpen}
        setIsOpen={setIsSaveModalOpen}
        isChangeData={isChangeData}
        setIsChangeData={setIsChangeData}
      />
    </>
  );
};
export default AdminSingleOrder;
