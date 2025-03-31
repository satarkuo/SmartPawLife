import { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../redux/toastSlice';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

function DeleteCouponModal({
  tempModalData,
  getCouponsList,
  setTempModalData,
  defaultData,
  isOpen,
  setIsOpen,
}) {
  const deleteCouponModalRef = useRef(null);
  useEffect(() => {
    // 取得或創建 Modal
    Modal.getOrCreateInstance(deleteCouponModalRef.current, {
      backdrop: 'static', //防止點擊背景關閉 Modal
      keyboard: false, //防止 Esc 關閉 Modal
    });
    // 設定 `hidden.bs.modal` 事件監聽，清理 `.modal-backdrop`
    deleteCouponModalRef.current.addEventListener('hidden.bs.modal', () => {
      document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getOrCreateInstance(deleteCouponModalRef.current);
      modalInstance.show();
      // 將焦點設置到模態框內的第一個可聚焦元素
      setTimeout(() => {
        const title = document.querySelector('.modal-title');
        if (title) {
          title.focus();
        }
      }, 150);
    }
  }, [isOpen]);

  //刪除產品
  const dispatch = useDispatch();
  const deleteCoupon = async () => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/${API_PATH}/admin/coupon/${tempModalData.id}`
      );
      dispatch(
        pushMessage({
          title: '優惠券已刪除',
          text: res.data.message,
          type: 'success',
        })
      );
    } catch (error) {
      dispatch(
        pushMessage({
          title: '刪除優惠券失敗',
          text: error.response.data.message,
          type: 'danger',
        })
      );
    }
  };

  // modal送出確認：刪除產品
  const [isLoading, setIsLoading] = useState(false); //局部loading
  const handleDeleteCoupon = async () => {
    setIsLoading(true);
    await deleteCoupon();
    await getCouponsList();
    await setIsLoading(false);
    await closeModal();
  };

  //關閉modal：刪除產品
  const closeModal = () => {
    const modalInstance = Modal.getInstance(deleteCouponModalRef.current); //取得modal
    modalInstance.hide();
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove()); // 確保 backdrop 被清除
    setIsOpen(false);
    setTempModalData(defaultData); //清空產品資料，避免影響下一步動作
    // 移除Modal焦點並將焦點設置到其他地方
    const triggerButton = document.querySelector('.btn-delete-outline'); // 修改為觸發Modal的按鈕選擇器
    if (triggerButton) {
      triggerButton.focus(); // 將焦點移到觸發按鈕
    }
  };

  return (
    <div className="modal fade" tabIndex="-1" ref={deleteCouponModalRef} id="delProductModal">
      <div className="modal-dialog ">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" tabIndex="0">
              刪除優惠券
            </h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            是否刪除優惠券 <span className="text-danger fw-bold">{tempModalData.title}</span>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              disabled={isLoading}
              className="btn btn-delete d-flex align-items-center justify-content-center gap-2"
              onClick={handleDeleteCoupon}
            >
              刪除
              {isLoading && (
                <ReactLoading type={'spin'} color={'#000'} height={'1.2rem'} width={'1.2rem'} />
              )}
            </button>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DeleteCouponModal;
DeleteCouponModal.propTypes = {
  tempModalData: PropTypes.object.isRequired,
  getCouponsList: PropTypes.func.isRequired,
  setTempModalData: PropTypes.func.isRequired,
  defaultData: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};
