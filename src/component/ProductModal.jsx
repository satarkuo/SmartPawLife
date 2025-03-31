import { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../redux/toastSlice';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

function ProductModal({
  tempModalData,
  getProductsList,
  setTempModalData,
  defaultData,
  isOpen,
  setIsOpen,
  modalMode,
}) {
  // modal
  const productModalRef = useRef(null);
  useEffect(() => {
    // 取得或創建 Modal
    Modal.getOrCreateInstance(productModalRef.current, {
      backdrop: 'static', //防止點擊背景關閉 Modal
      keyboard: false, //防止 Esc 關閉 Modal
    });
    // 設定 `hidden.bs.modal` 事件監聽，清理 `.modal-backdrop`
    productModalRef.current.addEventListener('hidden.bs.modal', () => {
      document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(productModalRef.current); //取得modal
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

  //新增產品
  const [isLoading, setIsLoading] = useState(false); //局部loading
  const dispatch = useDispatch();
  const createProduct = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/${API_PATH}/admin/product`, {
        data: {
          ...tempModalData,
          origin_price: Number(tempModalData.origin_price),
          price: Number(tempModalData.price),
          is_enabled: tempModalData.is_enabled ? 1 : 0,
        },
      });
      closeModal();
      dispatch(
        pushMessage({
          title: '新產品已建立',
          text: res.data.message,
          type: 'success',
        })
      );
    } catch (error) {
      dispatch(
        pushMessage({
          title: '新增產品失敗',
          text: error.response.data.message.join('、'),
          type: 'danger',
        })
      );
    }
  };
  //更新產品
  const updateProduct = async () => {
    try {
      const res = await axios.put(`${BASE_URL}/api/${API_PATH}/admin/product/${tempModalData.id}`, {
        data: {
          ...tempModalData,
          origin_price: Number(tempModalData.origin_price),
          price: Number(tempModalData.price),
          is_enabled: tempModalData.is_enabled ? 1 : 0,
        },
      });
      closeModal();
      dispatch(
        pushMessage({
          title: '產品資料已更新',
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

  //關閉modal：新增、編輯產品
  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current); //取得modal
    modalInstance.hide();
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove()); // 確保 backdrop 被清除
    setIsOpen(false);
    setTempModalData(defaultData); //清空產品資料，避免影響下一步動作
    // 移除modal焦點並將焦點設置到其他地方
    const triggerButton = document.querySelector('.btn'); // 修改為觸發模態框的按鈕選擇器
    if (triggerButton) {
      triggerButton.focus(); // 將焦點移到觸發按鈕
    }
  };

  // modal送出確認：新增或更新產品
  const handleUpdateProduct = async () => {
    setIsLoading(true);
    //判斷：新增或更新產品
    const apiCall = modalMode === 'create' ? createProduct : updateProduct;
    await apiCall();
    await getProductsList();
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
  //modal upload image
  const fileImageInputRef = useRef(null); //主圖上傳input
  const fileImagesInputRef = useRef(null); //副圖上傳input
  useEffect(() => {
    new Modal(fileImageInputRef.current);
    new Modal(fileImagesInputRef.current);
  }, []);
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    //API文件指定的input name -> formData的欄位:file-to-upload
    formData.append('file-to-upload', file);

    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/${API_PATH}/admin/upload`, formData);
      const uploadImageUrl = res.data.imageUrl;
      // 判斷是主圖還是副圖
      if (e.target.id === 'uploadMainImage') {
        setTempModalData((prevData) => ({
          ...prevData,
          imageUrl: uploadImageUrl,
        }));
        fileImageInputRef.current.value = ''; //清空上傳欄位
      } else if (e.target.id === 'uploadImages') {
        setTempModalData((prevData) => {
          const newImageUrl = [...prevData.imagesUrl];
          newImageUrl[newImageUrl.length - 1] = uploadImageUrl;
          return { ...prevData, imagesUrl: newImageUrl };
        });
        fileImagesInputRef.current.value = ''; //清空上傳欄位
      }
      dispatch(
        pushMessage({
          title: '圖片已上傳',
          text: '圖片上傳成功',
          type: 'success',
        })
      );
    } catch (error) {
      dispatch(
        pushMessage({
          title: '圖片上傳失敗',
          text: error.response.data.message,
          type: 'danger',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  //modal image
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    setTempModalData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages[index] = value;
      return { ...prevData, imagesUrl: newImages };
    });
  };
  //modal add image
  const addImage = () => {
    setTempModalData((prevData) => {
      const newImages = [...prevData.imagesUrl, ''];
      return { ...prevData, imagesUrl: newImages };
    });
  };
  //modal remove image
  const removeImage = () => {
    setTempModalData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages.pop();
      return { ...prevData, imagesUrl: newImages };
    });
  };
  //modal color
  const handleInputColorChange = (e, index) => {
    const { name, value } = e.target;
    const cleanName = name.replace(/[0-9]/g, ''); // 移除數字
    setTempModalData((prevData) => {
      const newColors = [...prevData.color];
      newColors[index] = {
        ...newColors[index],
        [cleanName]: value,
      };
      return {
        ...prevData,
        color: newColors,
      };
    });
  };
  //modal add color
  const addColor = () => {
    setTempModalData((prevData) => {
      const newColors = [...prevData.color, { colorName: '', colorCode: '' }];

      return {
        ...prevData,
        color: newColors,
      };
    });
  };
  //modal remove color
  const removeColor = () => {
    setTempModalData((prevData) => {
      const newColors = [...prevData.color];
      newColors.pop();
      return {
        ...prevData,
        color: newColors,
      };
    });
  };

  return (
    <div className="modal fade" tabIndex="-1" ref={productModalRef} id="productModal">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" tabIndex="0">
              {modalMode === 'create' ? '新增產品' : '編輯產品'}
            </h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <div className="row row-cols-2">
              <div className="col-3">
                <h4>產品主圖</h4>
                <div className="mb-3">
                  <label htmlFor="uploadMainImage" className="form-label">
                    {' '}
                    上傳主圖{' '}
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    id="uploadMainImage"
                    ref={fileImageInputRef}
                    onChange={handleFileChange}
                  />
                </div>
                <label htmlFor="main-image" className="form-label">
                  主圖
                </label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="imageUrl"
                    id="main-image"
                    value={tempModalData.imageUrl}
                    onChange={handleModalInputChange}
                    className="form-control"
                    placeholder="圖片網址"
                  />
                </div>
                {tempModalData.imageUrl ? (
                  <img
                    className="w-100 img-fluid rounded-3"
                    src={tempModalData.imageUrl}
                    alt={tempModalData.title}
                  />
                ) : (
                  ''
                )}
                <hr />
                <h4>產品副圖</h4>
                <div className="mb-3">
                  <label htmlFor="uploadImages" className="form-label">
                    {' '}
                    上傳副圖
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    ref={fileImagesInputRef}
                    id="uploadImages"
                    onChange={handleFileChange}
                  />
                </div>
                <div
                  className={`row ${tempModalData.imagesUrl.length === 1 ? 'row-cols-1' : 'row-cols-2'}`}
                >
                  {tempModalData.imagesUrl.map((img, index) => (
                    <div className="col p-2 rounded-3" key={index}>
                      副圖 #{index + 1}
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => handleImageChange(e, index)}
                        className="form-control mb-1"
                        placeholder={`圖片網址 #${index + 1}`}
                      />
                      {img && (
                        <img
                          className="w-100 img-fluid rounded-3"
                          src={img}
                          alt={`副圖${index + 1}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-between">
                  {tempModalData.imagesUrl.length < 5 &&
                    tempModalData.imagesUrl[tempModalData.imagesUrl.length - 1] !== '' && (
                      <button
                        type="button"
                        onClick={addImage}
                        className="btn btn-sm btn-edit w-100 rounded-0"
                      >
                        新增
                      </button>
                    )}
                  {tempModalData.imagesUrl.length > 1 && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="btn btn-sm btn-delete w-100 rounded-0"
                    >
                      移除
                    </button>
                  )}
                </div>
                <hr />
                <div style={{ fontSize: '14px' }} className="text-body-tertiary mb-3">
                  <h6>圖片格式說明：</h6>
                  <small>檔案類型：jpg、jpeg、png</small>
                  <br />
                  <small>建議尺寸：500px * 500px</small>
                  <br />
                  <small>檔案大小：3MB 以下</small>
                </div>
              </div>
              <div className="col-9">
                <h4>產品資料</h4>
                <label htmlFor="title" className="form-label">
                  標題
                </label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={tempModalData.title}
                    onChange={handleModalInputChange}
                    className="form-control"
                    placeholder="請輸入標題"
                  />
                </div>
                <label htmlFor="category" className="form-label">
                  分類
                </label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="category"
                    id="category"
                    value={tempModalData.category}
                    onChange={handleModalInputChange}
                    className="form-control"
                    placeholder="請輸入分類"
                  />
                </div>
                <div className="row row-cols-3">
                  <div className="col">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="number"
                        name="origin_price"
                        id="origin_price"
                        value={tempModalData.origin_price}
                        onChange={handleModalInputChange}
                        className="form-control"
                        placeholder="請輸入原價"
                      />
                    </div>
                  </div>
                  <div className="col">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={tempModalData.price}
                        onChange={handleModalInputChange}
                        className="form-control"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>
                  <div className="col">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        name="unit"
                        id="unit"
                        value={tempModalData.unit}
                        onChange={handleModalInputChange}
                        className="form-control"
                        placeholder="請輸入單位"
                      />
                    </div>
                  </div>
                </div>
                <label htmlFor="description" className="form-label">
                  產品描述
                </label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="description"
                    id="description"
                    value={tempModalData.description}
                    onChange={handleModalInputChange}
                    className="form-control"
                    placeholder="請輸入產品描述"
                  />
                </div>
                <label htmlFor="content" className="form-label">
                  產品說明
                </label>
                <div className="input-group mb-3">
                  <textarea
                    name="content"
                    id="content"
                    className="form-control"
                    value={tempModalData.content}
                    onChange={handleModalInputChange}
                    placeholder="請輸入產品說明"
                    rows={4}
                  ></textarea>
                </div>
                <label htmlFor="notice" className="form-label">
                  注意事項
                </label>
                <div className="input-group mb-3">
                  <textarea
                    name="notice"
                    id="notice"
                    className="form-control"
                    value={tempModalData.notice}
                    onChange={handleModalInputChange}
                    placeholder="請輸入注意事項"
                    rows={4}
                  ></textarea>
                </div>
                <hr />
                <h4>產品規格</h4>
                <div className="row row-cols-2">
                  <div className="col">
                    <label htmlFor="material" className="form-label">
                      材質
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        name="material"
                        id="material"
                        value={tempModalData.material}
                        onChange={handleModalInputChange}
                        className="form-control"
                        placeholder="請輸入材質"
                      />
                    </div>
                  </div>
                  <div className="col">
                    <label htmlFor="size" className="form-label">
                      尺寸
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        name="size"
                        id="size"
                        value={tempModalData.size}
                        onChange={handleModalInputChange}
                        className="form-control"
                        placeholder="請輸入尺寸"
                      />
                    </div>
                  </div>
                  <div className="col">
                    <label htmlFor="origin" className="form-label">
                      產地
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        name="origin"
                        id="origin"
                        value={tempModalData.origin}
                        onChange={handleModalInputChange}
                        className="form-control"
                        placeholder="請輸入產地"
                      />
                    </div>
                  </div>
                  <div className="col">
                    <label htmlFor="warranty" className="form-label">
                      保固
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        name="warranty"
                        id="warranty"
                        value={tempModalData.warranty}
                        onChange={handleModalInputChange}
                        className="form-control"
                        placeholder="請輸入保固"
                      />
                    </div>
                  </div>
                </div>
                {tempModalData.color.map((_, index) => {
                  return (
                    <div className="d-flex border-bottom mb-3" key={index}>
                      <div className="p-2">
                        <h5>產品顏色#{index + 1}</h5>
                      </div>
                      <div className="p-2 flex-grow-1">
                        <label htmlFor={`colorName${index + 1}`} className="form-label">
                          #{index + 1} 顏色名稱
                        </label>
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            name={`colorName${index + 1}`}
                            id={`colorName${index + 1}`}
                            value={tempModalData.color[index].colorName}
                            onChange={(e) => handleInputColorChange(e, index)}
                            className="form-control"
                            placeholder={`請輸入#${index + 1} 顏色名稱，例如低調灰`}
                          />
                        </div>
                      </div>
                      <div className="p-2 flex-grow-1">
                        <label htmlFor={`colorCode${index + 1}`} className="form-label">
                          #{index + 1} 顏色色碼
                          <span
                            className="ms-1 adminColorSquare"
                            style={{ backgroundColor: tempModalData.color[index].colorCode }}
                          ></span>
                        </label>
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            name={`colorCode${index + 1}`}
                            id={`colorCode${index + 1}`}
                            value={tempModalData.color[index].colorCode}
                            onChange={(e) => handleInputColorChange(e, index)}
                            className="form-control"
                            placeholder={`請輸入#${index + 1} 顏色色碼，例如#eeeeee`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {tempModalData.color.length < 4 &&
                  tempModalData.color[tempModalData.color.length - 1].colorName !== '' &&
                  tempModalData.color[tempModalData.color.length - 1].colorCode !== '' && (
                    <button
                      type="button"
                      onClick={addColor}
                      className="btn btn-sm btn-edit w-100 rounded-0"
                    >
                      新增
                    </button>
                  )}
                {tempModalData.color.length > 1 && (
                  <button
                    type="button"
                    onClick={removeColor}
                    className="btn btn-sm btn-delete w-100 rounded-0"
                  >
                    移除
                  </button>
                )}
                <div className="form-check mt-3">
                  <input
                    type="checkbox"
                    name="is_newest"
                    id="isNewest"
                    checked={tempModalData.is_newest || false}
                    onChange={handleModalInputChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="isNewest">
                    設為新品報到
                  </label>
                </div>
                <div className="form-check mt-3">
                  <input
                    type="checkbox"
                    name="is_hottest"
                    id="isHottest"
                    checked={tempModalData.is_hottest || false}
                    onChange={handleModalInputChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="isHottest">
                    設為冠軍排行
                  </label>
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

export default ProductModal;
ProductModal.propTypes = {
  tempModalData: PropTypes.object.isRequired,
  getProductsList: PropTypes.func.isRequired,
  setTempModalData: PropTypes.func.isRequired,
  defaultData: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  modalMode: PropTypes.oneOf(['create', 'edit']),
};
