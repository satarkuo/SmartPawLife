import { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../redux/toastSlice';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

function DeleteOrderModal({ tempModalData, getOrdersList, setTempModalData, isOpen, setIsOpen }) {
  const deleteOrderModalRef = useRef(null);
  useEffect(() => {
    // 取得或創建 Modal
    Modal.getOrCreateInstance(deleteOrderModalRef.current, {
      backdrop: 'static', //防止點擊背景關閉 Modal
      keyboard: false, //防止 Esc 關閉 Modal
    });
    // 設定 `hidden.bs.modal` 事件監聽，清理 `.modal-backdrop`
    deleteOrderModalRef.current.addEventListener('hidden.bs.modal', () => {
      document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getOrCreateInstance(deleteOrderModalRef.current);
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

  //刪除訂單
  const dispatch = useDispatch();
  const deleteOrder = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`${BASE_URL}/api/${API_PATH}/admin/order/${tempModalData.id}`);
      dispatch(
        pushMessage({
          title: '訂單已刪除',
          text: res.data.message,
          type: 'success',
        })
      );
    } catch (error) {
      dispatch(
        pushMessage({
          title: '刪除訂單失敗',
          text: error.response.data.message,
          type: 'danger',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // modal送出確認：刪除訂單
  const [isLoading, setIsLoading] = useState(false); //局部loading
  const handleDeleteOrder = async () => {
    await deleteOrder();
    await getOrdersList();
    await closeDeleteOrderModal();
  };

  //關閉modal：刪除訂單
  const closeDeleteOrderModal = () => {
    const modalInstance = Modal.getInstance(deleteOrderModalRef.current); //取得modal
    modalInstance.hide();
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    setIsOpen(false);
    setTempModalData({}); //清空訂單資料，避免影響下一步動作
    // 移除Modal焦點並將焦點設置到其他地方
    const triggerButton = document.querySelector('.btn-delete-outline'); // 修改為觸發Modal的按鈕選擇器
    if (triggerButton) {
      triggerButton.focus(); // 將焦點移到觸發按鈕
    }
  };

  return (
    <div className="modal fade" tabIndex="-1" ref={deleteOrderModalRef} id="delProductModal">
      <div className="modal-dialog ">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" tabIndex="0">
              刪除訂單
            </h5>
            <button type="button" className="btn-close" onClick={closeDeleteOrderModal}></button>
          </div>
          <div className="modal-body">
            是否刪除訂單 <span className="text-danger fw-bold">{tempModalData.title}</span>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              disabled={isLoading}
              className="btn btn-delete d-flex align-items-center justify-content-center gap-2"
              onClick={handleDeleteOrder}
            >
              刪除
              {isLoading && (
                <ReactLoading type={'spin'} color={'#000'} height={'1.2rem'} width={'1.2rem'} />
              )}
            </button>
            <button type="button" className="btn btn-secondary" onClick={closeDeleteOrderModal}>
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DeleteOrderModal;
DeleteOrderModal.propTypes = {
  tempModalData: PropTypes.object.isRequired,
  getOrdersList: PropTypes.func.isRequired,
  setTempModalData: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};
