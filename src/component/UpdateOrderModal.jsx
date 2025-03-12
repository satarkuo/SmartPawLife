import { useState, useEffect, useRef } from 'react'
import { Modal } from 'bootstrap';
import axios from 'axios';
import ReactLoading from "react-loading";
import PropTypes from 'prop-types'; 
import { useDispatch } from 'react-redux';
import { pushMessage } from '../redux/toastSlice';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

function UpdateOrderModal({
        data,
        setData,
        isOpen,
        setIsOpen,
        setIsChangeData
    }){

    const updateOrderModalRef = useRef(null);
    useEffect(() => {
        // 取得或創建 Modal
        Modal.getOrCreateInstance(updateOrderModalRef.current,{
            backdrop: 'static', //防止點擊背景關閉 Modal
            keyboard: false //防止 Esc 關閉 Modal
        });
        // 設定 `hidden.bs.modal` 事件監聽，清理 `.modal-backdrop`
        updateOrderModalRef.current.addEventListener('hidden.bs.modal', () => {
            document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
        });

    
    }, [])

    useEffect(() => {
        if(isOpen) {
            const modalInstance = Modal.getOrCreateInstance(updateOrderModalRef.current);
            modalInstance.show();
            // 將焦點設置到模態框內的第一個可聚焦元素
            setTimeout(() => {
                const title = document.querySelector('.modal-title');
                if (title) {
                    title.focus();
                }
            }, 150)
        } 
    },[isOpen])

    //更新訂單
    const dispatch = useDispatch();
    const updateOrder = async () => {
        try {
            const res = await axios.put(`${BASE_URL}/api/${API_PATH}/admin/order/${data.id}`, { data })
            dispatch(pushMessage({
                title: '訂單已更新',
                text: res.data.message,
                type: 'success'
            }))
            setIsChangeData(true)
        } catch (error) {
            console.log(error)
            dispatch(pushMessage({
                title: '更新訂單失敗',
                text: error.response.data.message,
                type: 'danger'
            }))
        }
    }
  
    // modal送出確認：確認更新
    const [isLoading, setIsLoading] = useState(false); //局部loading
    const handleUpdateOrder = async () => {
        setIsLoading(true)
        await updateOrder();
        await setIsLoading(false)
        await closeUpdateOrderModal();
        
    }

    //關閉modal：變更訂單
    const closeUpdateOrderModal = () => {
        const modalInstance = Modal.getInstance(updateOrderModalRef.current) //取得modal
        modalInstance.hide();
        document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
        setIsOpen(false);
        setData({}); //清空訂單資料，避免影響下一步動作
        // 移除modal焦點並將焦點設置到其他地方
        const triggerButton = document.querySelector('.btn-delete-outline'); // 修改為觸發模態框的按鈕選擇器
        if (triggerButton) {
            triggerButton.focus(); // 將焦點移到觸發按鈕
        }
    }

    return (
        <div className="modal fade" tabIndex="-1" ref={updateOrderModalRef} id="delProductModal">
            <div className="modal-dialog ">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" tabIndex="0">確認變更</h5>
                        <button type="button" className="btn-close" onClick={closeUpdateOrderModal}></button>
                    </div>
                    <div className="modal-body">
                        是否確認變更訂單？
                    </div>
                    <div className="modal-footer">
                        
                        <button type="button" className="btn btn-secondary" onClick={closeUpdateOrderModal}>取消</button>
                        <button type="button" disabled={isLoading}
                            className="btn btn-primary d-flex align-items-center justify-content-center gap-2" 
                            onClick={handleUpdateOrder}>
                            確定儲存變更
                            {isLoading && (
                                <ReactLoading type={"spin"} color={"#000"} height={"1.2rem"} width={"1.2rem"} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default UpdateOrderModal;
UpdateOrderModal.propTypes = {
    data: PropTypes.object.isRequired,
    setData: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    setIsChangeData: PropTypes.func.isRequired
}