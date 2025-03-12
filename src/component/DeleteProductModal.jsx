import { useState, useEffect, useRef } from 'react'
import { Modal } from 'bootstrap';
import axios from 'axios';
import ReactLoading from "react-loading";
import PropTypes from 'prop-types'; 
import { useDispatch } from 'react-redux';
import { pushMessage } from '../redux/toastSlice';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

function DeleteProductModal({
        tempModalData,
        getProductsList,
        setTempModalData,
        defaultData,
        isOpen,
        setIsOpen
    }){

    const deleteProductModalRef = useRef(null);
    useEffect(() => {
        // 取得或創建 Modal
        Modal.getOrCreateInstance(deleteProductModalRef.current,{
            backdrop: 'static', //防止點擊背景關閉 Modal
            keyboard: false //防止 Esc 關閉 Modal
        });
        // 設定 `hidden.bs.modal` 事件監聽，清理 `.modal-backdrop`
        deleteProductModalRef.current.addEventListener('hidden.bs.modal', () => {
            document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
        });
    }, [])

    useEffect(() => {
        if(isOpen) {
            const modalInstance = Modal.getOrCreateInstance(deleteProductModalRef.current);
            modalInstance.show();
            // 將焦點設置到Modal內的第一個可聚焦元素
            setTimeout(() => {
                const title = document.querySelector('.modal-title');
                if (title) {
                    title.focus();
                }
            }, 150)
        } 
    },[isOpen])

    //刪除產品
    const dispatch = useDispatch();
    const deleteProduct = async () => {
        try {
            const res = await axios.delete(`${BASE_URL}/api/${API_PATH}/admin/product/${tempModalData.id}`)
            dispatch(pushMessage({
                title: '產品已刪除',
                text: res.data.message,
                type: 'success'
            }))
        } catch (error) {
            dispatch(pushMessage({
                title: '刪除產品失敗',
                text: error.response.data.message,
                type: 'danger'
            }))
        }
    }
  
    // modal送出確認：刪除產品
    const [isLoading, setIsLoading] = useState(false); //局部loading
    const handleDeleteProduct = async () => {
        setIsLoading(true)
        await deleteProduct();
        await getProductsList();
        await setIsLoading(false)
        await closeDeleteProductModal();
        
    }

    //關閉modal：刪除產品
    const closeDeleteProductModal = () => {
        const modalInstance = Modal.getInstance(deleteProductModalRef.current) //取得modal
        modalInstance.hide();
        document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
        setIsOpen(false);
        setTempModalData(defaultData); //清空產品資料，避免影響下一步動作
        // 移除modal焦點並將焦點設置到其他地方
        const triggerButton = document.querySelector('.btn-delete-outline'); // 修改為觸發模態框的按鈕選擇器
        if (triggerButton) {
            triggerButton.focus(); // 將焦點移到觸發按鈕
        }
    }

    return (
        <div className="modal fade" tabIndex="-1" ref={deleteProductModalRef} id="delProductModal">
            <div className="modal-dialog ">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" tabIndex="0">刪除產品</h5>
                        <button type="button" className="btn-close" onClick={closeDeleteProductModal}></button>
                    </div>
                    <div className="modal-body">
                        是否刪除產品 <span className="text-danger fw-bold">{tempModalData.title}</span>
                    </div>
                    <div className="modal-footer">
                        <button type="button" disabled={isLoading}
                            className="btn btn-delete d-flex align-items-center justify-content-center gap-2" 
                            onClick={handleDeleteProduct}>
                            刪除
                            {isLoading && (
                                <ReactLoading type={"spin"} color={"#000"} height={"1.2rem"} width={"1.2rem"} />
                            )}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={closeDeleteProductModal}>取消</button>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default DeleteProductModal;
DeleteProductModal.propTypes = {
    tempModalData: PropTypes.object.isRequired,
    getProductsList: PropTypes.func.isRequired,
    setTempModalData: PropTypes.func.isRequired,
    defaultData: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired
}