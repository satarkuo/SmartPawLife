import { useState, useEffect } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import Pagination from '../../component/Pagination';
import ProductModal from '../../component/ProductModal';
import DeleteProductModal from '../../component/DeleteProductModal';
import { useDispatch } from "react-redux";
import { pushMessage } from "../../redux/toastSlice";

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;


const AdminProduct = () => {
    const [isScreenLoading, setIsScreenLoading] = useState(false); //全螢幕Loading
    const dispatch = useDispatch();
    
    //Products
    const [productsData, setProductsData] = useState([]) //所有產品資訊
    // 產品預設資料：以單層為主(增加新欄位時，方便與現有產品資料合併)
    let defaultData = {
        id: '',
        title: '',
        category:'',
        content:'',
        description:'',
        notice:'',
        imageUrl:'',
        imagesUrl:[''], //預設值帶入一個空值，才能顯示第一個input新增圖片
        is_enabled: false,
        is_hottest: false,
        is_newest: false,
        origin_price:'',
        price: '',
        unit: '',
        num: '',
        material: '',
        size: '',
        color: [
            {
            colorName: '',
            colorCode: ''
            }
        ],
        origin: '',
        warranty: ''
    }
    //取得產品列表
    const getProductsList = async (page=1) => {
        setIsScreenLoading(true)
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/admin/products?page=${page}`)
            setProductsData(res.data.products)
            setPageInfo(res.data.pagination)
        } catch (error) {
            dispatch(pushMessage({
                title: '產品資料取得失敗',
                text: error.response.data.message,
                type: 'danger'
            }))
        } finally {
            setIsScreenLoading(false)
        }
    }

    useEffect(() => {
        getProductsList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //頁碼邏輯
    const [pageInfo, setPageInfo] = useState({}); 
    const handlePageChange = (page) => {
        getProductsList(page)
        window.scrollTo(0, 0);
    }

    //Modal
    const [modalMode, setModalMode] = useState(null); //modal模式：新增 create、編輯 edit、刪除 delete
    const [tempModalData, setTempModalData] = useState(defaultData);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
    
    //開啟modal：新增、編輯產品
    const openModal = (mode, product) => {
        setModalMode(mode)
        switch (mode) {
            case 'create':
                setTempModalData(defaultData);
                break;
            case 'edit':
                // 新增API欄位，需要同步於舊有資料
                // 所有的屬性會被後方相同屬性名稱的值覆寫。
                // 注意：此寫法只能覆寫兩個物件的第一層
                var addNewKeyProduct = Object.assign({}, defaultData, product);
                setTempModalData(addNewKeyProduct);
                break
            default:
                break;
        }
        setIsProductModalOpen(true);
    }
    //開啟modal：刪除產品
    const openDeleteProductModal = (mode, product) => {
        setModalMode(mode);
        setTempModalData(product);
        setIsDeleteProductModalOpen(true);
    }

    return (
        <>
            <section>
                
                <div className="table-responsive p-4 bg-white rounded-4">
                    <div className="d-flex justify-content-between mb-4">
                        <h1 className="h4 my-0">產品管理</h1>
                        <button type="button" className="btn btn-edit" onClick={() => openModal('create')}>新增產品</button>
                    </div>
                    <table className="table align-middle adminTable">
                        <thead>
                            <tr>
                                <th scope="col" width={50} className="textBody3">No.</th>
                                <th scope="col">分類</th>
                                <th scope="col" width={100}>主圖</th>
                                <th scope="col">產品名稱</th>
                                <th scope="col">原價</th>
                                <th scope="col">售價</th>
                                <th scope="col" className="text-center">是否啟用</th>
                                <th scope="col">功能</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsData && productsData.length > 0 ? (
                                productsData.map( product => (
                                <tr key={product.id}>
                                    <td><span className="textBody3">{product.num}</span></td>
                                    <td>{product.category}</td>
                                    <td><img src={product.imageUrl} width="80" className="rounded-3" /></td>
                                    <td>
                                        {product.title}
                                        <span><br/>
                                            {product.is_newest && 
                                                <span className="d-inline-flex align-items-center textBody3 text-info me-2">
                                                    <span className="material-icons textBody2 text-info">verified</span>
                                                    新品報到
                                                </span>
                                                
                                            }
                                            {product.is_hottest && 
                                                <span className="d-inline-flex align-items-center textBody3 text-danger me-2">
                                                    <span className="material-icons textBody2 text-danger">local_fire_department</span>
                                                    冠軍排行
                                                </span>
                                            }
                                        </span>
                                    </td>
                                    <td>{product.origin_price.toLocaleString()}</td>
                                    <td>{product.price.toLocaleString()}</td>
                                    <td className="text-center">
                                        {product.is_enabled ? 
                                            <span className="badge rounded-pill text-bg-success text-white d-inline-flex">
                                                <span className="material-icons align-content-center fs-6 me-1">check</span>
                                                啟用
                                            </span> :
                                            <span className="badge rounded-pill text-bg-danger text-white d-inline-flex">
                                                <span className="material-icons align-content-center fs-6 me-1">clear</span>
                                                停用
                                            </span>
                                        }
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-edit-outline me-3" 
                                            onClick={() => openModal('edit', product)}>編輯</button>
                                        <button type="button" className="btn btn-delete-outline me-3"
                                            onClick={() => openDeleteProductModal('delete', product)}>刪除</button>
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8"><p className="text-center text-secondary my-0 textBody3">目前沒有產品</p></td></tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange}/>
                </div>
                
            </section>
            {modalMode !== 'delete' && (
                <ProductModal 
                    tempModalData={tempModalData}
                    getProductsList={getProductsList}
                    setTempModalData={setTempModalData}
                    defaultData={defaultData} 
                    isOpen={isProductModalOpen} 
                    setIsOpen={setIsProductModalOpen}
                    modalMode={modalMode} 
                />
            )}
            {modalMode === 'delete' && (
                <DeleteProductModal 
                    tempModalData={tempModalData}
                    getProductsList={getProductsList}
                    setTempModalData={setTempModalData}
                    defaultData={defaultData}
                    isOpen={isDeleteProductModalOpen}
                    setIsOpen={setIsDeleteProductModalOpen}
                />
            )}
            
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
        </>
        
    )
}
export default AdminProduct;