import { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../redux/toastSlice';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

function CouponModal({
  tempModalData,
  getCouponsList,
  setTempModalData,
  defaultData,
  date,
  setDate,
  isOpen,
  setIsOpen,
  modalMode,
}) {
  // modal
  const couponModalRef = useRef(null);
  useEffect(() => {
    // 取得或創建 Modal
    Modal.getOrCreateInstance(couponModalRef.current, {
      backdrop: 'static', //防止點擊背景關閉 Modal
      keyboard: false, //防止 Esc 關閉 Modal
    });
    // 設定 `hidden.bs.modal` 事件監聽，清理 `.modal-backdrop`
    couponModalRef.current.addEventListener('hidden.bs.modal', () => {
      document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(couponModalRef.current); //取得modal
      modalInstance.show();
      // 將焦點設置到Modal內的第一個可聚焦元素
      setTimeout(() => {
        const title = document.querySelector('.modal-title');
        if (title) {
          title.focus();
        }
      }, 150);
    }
  }, [isOpen]);

  //新增優惠券
  const [isLoading, setIsLoading] = useState(false); //局部loading
  const dispatch = useDispatch();

  const createCoupon = async () => {
    const data = {
      ...tempModalData,
      is_enabled: tempModalData.is_enabled ? 1 : 0,
      percent: Number(tempModalData.percent),
      due_date: date,
    };
    try {
      const res = await axios.post(`${BASE_URL}/api/${API_PATH}/admin/coupon`, { data });
      closeModal();
      dispatch(
        pushMessage({
          title: '新優惠券已建立',
          text: res.data.message,
          type: 'success',
        })
      );
    } catch (error) {
      dispatch(
        pushMessage({
          title: '新增優惠券失敗',
          text: error.response.data.message.join('、'),
          type: 'danger',
        })
      );
    }
  };
  //更新優惠券
  const updateCoupon = async () => {
    const data = {
      ...tempModalData,
      is_enabled: tempModalData.is_enabled ? 1 : 0,
      percent: Number(tempModalData.percent),
      due_date: date,
    };
    try {
      const res = await axios.put(`${BASE_URL}/api/${API_PATH}/admin/coupon/${tempModalData.id}`, {
        data,
      });
      closeModal();
      dispatch(
        pushMessage({
          title: '優惠券資料已更新',
          text: res.data.message,
          type: 'success',
        })
      );
    } catch (error) {
      dispatch(
        pushMessage({
          title: '更新產品失敗',
          text: error.response.data.message.join('、'),
          type: 'danger',
        })
      );
    }
  };

  //關閉modal：新增、編輯優惠券
  const closeModal = () => {
    const modalInstance = Modal.getInstance(couponModalRef.current); //取得modal
    modalInstance.hide();
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove()); // 確保 backdrop 被清除
    setIsOpen(false);
    setTempModalData(defaultData); //清空資料，避免影響下一步動作
    // 移除Modal焦點並將焦點設置到其他地方
    const triggerButton = document.querySelector('.btn'); // 修改為觸發Modal的按鈕選擇器
    if (triggerButton) {
      triggerButton.focus(); // 將焦點移到觸發按鈕
    }
  };

  //modal送出確認：新增或更新優惠券
  const handleUpdateProduct = async () => {
    setIsLoading(true);
    //判斷：新增或更新產品
    const apiCall = modalMode === 'create' ? createCoupon : updateCoupon;
    await apiCall();
    await getCouponsList();
    await setIsLoading(false);
  };

  //modal input
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTempModalData((prevData) => ({
      ...prevData,
      //若type是checkbox則取得checked的值，否則取得value的值
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  //modal input：優惠券：限制範圍1-99
  const handleModalDiscountInputChange = (e) => {
    const { name } = e.target;
    let value = Number(e.target.value);
    if (value < 1) value = 1; // 限制最小值1
    if (value > 100) value = 99; // 限制最大值99
    if (value < 0) value = 0; // 限制為正數
    setTempModalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //modal input：到期日 ，格式轉換為 Unix Timestamp
  const handleDateChange = (e) => {
    const selectedDate = e.target.value; // YYYY-MM-DD
    const date = new Date(selectedDate);
    date.setHours(23, 59, 59, 0); // 固定時間為 23:59:59
    const newTimestamp = Math.floor(date.getTime() / 1000); // 轉為 Unix Timestamp
    setDate(newTimestamp);
  };

  return (
    <div className="modal fade" tabIndex="-1" ref={couponModalRef} id="couponModal">
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" tabIndex="0">
              {modalMode === 'create' ? '新增優惠券' : '編輯優惠券'}
            </h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <label htmlFor="title" className="form-label">
              主題
            </label>
            <div className="input-group mb-3">
              <input
                type="text"
                name="title"
                id="title"
                value={tempModalData.title}
                onChange={handleModalInputChange}
                className="form-control"
                placeholder="請輸入主題"
              />
            </div>
            <div className="row row-cols-2">
              <div className="col">
                <label htmlFor="code" className="form-label">
                  折扣碼
                </label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="code"
                    id="code"
                    value={tempModalData.code}
                    onChange={handleModalInputChange}
                    className="form-control"
                    placeholder="請輸入折扣碼"
                  />
                </div>
              </div>
              <div className="col">
                <label htmlFor="percent" className="form-label">
                  折扣
                  <span className="textBody3 ms-2 text-body-tertiary">1-99</span>
                </label>
                <div className="input-group mb-3 d-flex align-items-center">
                  <input
                    type="number"
                    name="percent"
                    id="percent"
                    value={tempModalData.percent}
                    onChange={handleModalDiscountInputChange}
                    className="form-control me-2"
                    placeholder="請輸入折扣"
                  />{' '}
                  ％
                </div>
              </div>
            </div>

            <label htmlFor="due_date" className="form-label">
              到期日
              {modalMode === 'create' ? (
                <span className="textBody3 ms-2 text-body-tertiary">預設一個月以後</span>
              ) : (
                ''
              )}
            </label>
            <div className="input-group mb-3">
              <input
                type="date"
                name="due_date"
                id="due_date"
                value={date ? new Date(date * 1000).toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                className="form-control"
                placeholder="請選擇到期日"
              />
            </div>
            <div className="form-check mt-3">
              <input
                type="checkbox"
                name="is_enabled"
                id="isEnabled"
                checked={tempModalData.is_enabled}
                onChange={handleModalInputChange}
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="isEnabled">
                是否啟用
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              取消
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="btn btn btn-primary d-flex align-items-center justify-content-center gap-2"
              onClick={handleUpdateProduct}
            >
              確認
              {isLoading && (
                <ReactLoading type={'spin'} color={'#000'} height={'1.2rem'} width={'1.2rem'} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponModal;
CouponModal.propTypes = {
  tempModalData: PropTypes.object.isRequired,
  getCouponsList: PropTypes.func.isRequired,
  setTempModalData: PropTypes.func.isRequired,
  defaultData: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  modalMode: PropTypes.oneOf(['create', 'edit']),
};
