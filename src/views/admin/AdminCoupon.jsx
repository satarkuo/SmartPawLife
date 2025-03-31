import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../component/Pagination';
import ReactLoading from 'react-loading';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';
import CouponModal from '../../component/CouponModal';
import DeleteCouponModal from '../../component/DeleteCouponModal';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const AdminCoupon = () => {
  const dispatch = useDispatch();

  //全螢幕Loading
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  //頁碼邏輯
  const [pageInfo, setPageInfo] = useState({});
  const handlePageChange = (page) => {
    getCouponsList(page);
    window.scrollTo(0, 0);
  };

  //取得優惠券
  const [couponsList, setCouponsList] = useState([]); //全部優惠券list
  const getCouponsList = async (page = 1) => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/admin/coupons?page=${page}`);
      setCouponsList(res.data.coupons);
      setPageInfo(res.data.pagination);
    } catch (error) {
      dispatch(
        pushMessage({
          title: '優惠券資料取得失敗',
          text: error.response.data.message,
          type: 'danger',
        })
      );
    } finally {
      setIsScreenLoading(false);
    }
  };
  useEffect(() => {
    getCouponsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const defaultData = {
    title: '',
    is_enabled: false,
    percent: '',
    due_date: '',
    code: '',
  };
  //Modal
  const [modalMode, setModalMode] = useState(null); //modal模式：新增 create、編輯 edit、刪除 delete
  const [tempModalData, setTempModalData] = useState(defaultData);
  const [date, setDate] = useState(new Date());
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isDeleteCouponModalOpen, setIsDeleteCouponModalOpen] = useState(false);

  //開啟modal：新增、編輯優惠券
  const openModal = (mode, coupon) => {
    setModalMode(mode);

    const now = new Date(); // 取得當前時間
    now.setMonth(now.getMonth() + 1); // 預設往後加 1 個月
    now.setHours(23, 59, 59, 0); // 設為當天的 23:59:59
    const timestamp = Math.floor(now.getTime() / 1000); // 轉換成 Unix Timestamp

    switch (mode) {
      case 'create':
        setTempModalData(defaultData);
        setDate(timestamp);
        break;
      case 'edit':
        // 新增API欄位，需要同步於舊有資料
        // 所有的屬性會被後方相同屬性名稱的值覆寫。
        // 注意：此寫法只能覆寫兩個物件的第一層
        var addNewKeyCoupon = Object.assign({}, defaultData, coupon);
        setTempModalData(addNewKeyCoupon);
        setDate(coupon.due_date);
        break;
      default:
        break;
    }
    setIsCouponModalOpen(true);
  };
  //開啟modal：刪除優惠券
  const openDeleteCouponModal = (mode, coupon) => {
    setModalMode(mode);
    setTempModalData(coupon);
    setIsDeleteCouponModalOpen(true);
  };

  return (
    <>
      <section>
        <div className="table-responsive p-4 bg-white rounded-4">
          <div className="d-flex justify-content-between mb-4">
            <h1 className="h4 my-0">優惠券管理</h1>
            <button type="button" className="btn btn-edit" onClick={() => openModal('create')}>
              新增優惠券
            </button>
          </div>
          <table className="table align-middle adminTable">
            <thead>
              <tr>
                <th scope="col" width={50} className="textBody3">
                  No.
                </th>
                <th scope="col">id</th>
                <th scope="col">主題</th>
                <th scope="col">折扣碼</th>
                <th scope="col" className="text-end">
                  折數
                </th>
                <th scope="col" className="text-center">
                  到期日
                </th>
                <th scope="col" className="text-center">
                  啟用停用
                </th>
                <th scope="col">功能</th>
              </tr>
            </thead>
            <tbody>
              {couponsList && couponsList.length > 0 ? (
                couponsList.map((coupon) => (
                  <tr key={coupon.id}>
                    <td>
                      <span className="textBody3">{coupon.num}</span>
                    </td>
                    <td>
                      <span className="textBody3">{coupon.id}</span>
                    </td>
                    <td>
                      <span className="h6">{coupon.title}</span>
                    </td>
                    <td>{coupon.code}</td>
                    <td className="text-end">{coupon.percent} ％</td>
                    <td className="text-center">
                      <span style={{ whiteSpace: 'pre-line' }}>
                        {new Date(coupon.due_date * 1000).toISOString().split('T')[0]}
                      </span>
                      {}
                    </td>
                    <td className="text-center">
                      {coupon.is_enabled ? (
                        <span className="badge rounded-pill text-bg-success text-white d-inline-flex">
                          <span className="material-icons align-content-center fs-6 me-1">
                            check
                          </span>
                          啟用
                        </span>
                      ) : (
                        <span className="badge rounded-pill text-bg-danger text-white d-inline-flex">
                          <span className="material-icons align-content-center fs-6 me-1">
                            clear
                          </span>
                          停用
                        </span>
                      )}
                      {coupon.due_date < Math.floor(new Date().getTime() / 1000) && (
                        <span className="badge rounded-pill text-bg-secondary text-white d-inline-flex ms-2">
                          <span className="material-icons align-content-center fs-6 me-1">
                            clear
                          </span>
                          過期
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-edit-outline me-3"
                        onClick={() => openModal('edit', coupon)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-delete-outline me-3"
                        onClick={() => openDeleteCouponModal('delete', coupon)}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <p className="text-center text-secondary my-0 textBody3">目前沒有優惠券</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
        </div>
      </section>

      {modalMode !== 'delete' && (
        <CouponModal
          tempModalData={tempModalData}
          getCouponsList={getCouponsList}
          setTempModalData={setTempModalData}
          defaultData={defaultData}
          date={date}
          setDate={setDate}
          isOpen={isCouponModalOpen}
          setIsOpen={setIsCouponModalOpen}
          modalMode={modalMode}
        />
      )}
      {modalMode === 'delete' && (
        <DeleteCouponModal
          tempModalData={tempModalData}
          getCouponsList={getCouponsList}
          setTempModalData={setTempModalData}
          defaultData={defaultData}
          isOpen={isDeleteCouponModalOpen}
          setIsOpen={setIsDeleteCouponModalOpen}
        />
      )}
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

export default AdminCoupon;
