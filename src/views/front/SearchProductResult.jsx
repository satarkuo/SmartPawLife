// import { useEffect } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { resetSelectedFilters, setSearchValue, setSingleFilter } from "../../redux/searchSlice";
import { setFilterProducts } from "../../redux/productSlice";
import useScreenSize from '../../hooks/useScreenSize';
import productInfoData from "../../data/productInfoData";

const SearchProductResult = () => {
    //RWD:自訂hook
    const { screenWidth } = useScreenSize();
    const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false

    const { search } = useParams(); 
    const dispatch = useDispatch();
    //RTK取得：產品搜尋結果
    const filterProducts = useSelector(state => state.product.filterProducts)
    //RTK取得：首頁輸入的搜尋關鍵字
    const searchValue = useSelector(state => state.search.searchValue)    
    //RTK取得：全部產品列表
    const allProducts = useSelector(state => state.product.allProducts)

    useEffect(() => {
        //首頁若有搜尋則帶出搜尋結果
        if (searchValue !== '') {
            dispatch(resetSelectedFilters())
            let result = [...allProducts];
            result = result.filter(product => product.title.includes(searchValue))
            dispatch(setFilterProducts(result))
            dispatch(setSearchValue(''))
        }
        
    }, [searchValue, allProducts, dispatch]);


    //RTK取得：首頁送出的的單一filter
    const singleFilter = useSelector(state => state.search.singleFilter)
    useEffect(() => {

        //首頁：限時優惠、熱門產品、最新產品：顯示單一分類產品搜尋結果
        if (singleFilter !== '') {
            dispatch(resetSelectedFilters())
            dispatch(setSearchValue(''))
            let result = [...allProducts];
            if (singleFilter === 'is_discounted') {
                result = result.filter(product => product.origin_price > product.price)
            } else {
                result = result.filter(product => product[singleFilter])
            }
            
            dispatch(setFilterProducts(result))
            dispatch(setSingleFilter(''))
        }
        
    }, [searchValue, allProducts, dispatch]);

    return (<div>
        <div className="mb-5">
            <h1 className={`${isMobile ? 'h4' : 'h3'}  mt-0 text-primary`}>{productInfoData[search]?.title ? productInfoData[search].title : `關鍵字結果：${search}`}</h1>
            {productInfoData[search]?.content &&
                <div className={isMobile ? 'textBody2' : 'textBody1'}>
                    <div dangerouslySetInnerHTML={{ __html: productInfoData[search].content }} />
                </div>
            }
            
        </div>
        <p className="textBody2 text-secondary">
            共 {filterProducts.length} 項 <span className="text-primary">{search}</span> 商品
        </p>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3">
            
            {filterProducts?.map((product) => (
                <div className="col mb-5" key={product.id}>
                    <Link to={`/productList/${product.id}`} 
                        onClick={() => window.scrollTo(0, 0)}
                        className="h-100 w-100">
                        <div className="productCard">
                            <img className="img-fluid round-top"
                                src={product.imageUrl}
                                alt={product.title}
                            />
                            <div className="card-body">
                                <p className="card-title h5 m-0">{product.title}</p>
                                <p className="card-text textBody2">{product.description}</p>
                            </div>
                            <div className="card-footer">
                                <div className="textBody2 text-primary">$ {product.price.toLocaleString()}</div>
                                { product.origin_price > product.price && 
                                    <del className="textBody3 text-body-tertiary align-self-center">$ {product.origin_price.toLocaleString()}</del>}
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    </div>)
}
export default SearchProductResult;