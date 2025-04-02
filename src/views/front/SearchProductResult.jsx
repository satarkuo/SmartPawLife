import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useScreenSize from '../../hooks/useScreenSize';
import productInfoData from '../../data/productInfoData';
import ProductCard from '../../component/ProductCard';

const SearchProductResult = () => {
  //RWD:自訂hook
  const { screenWidth } = useScreenSize();
  const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false

  const { search } = useParams();
  //RTK取得：產品搜尋結果
  const filterProducts = useSelector((state) => state.product.filterProducts);

  return (
    <div>
      <div className="mb-5">
        <h1 className={`${isMobile ? 'h4' : 'h3'}  mt-0 text-primary`}>
          {productInfoData[search]?.title
            ? productInfoData[search].title
            : `關鍵字搜尋結果：${search}`}
        </h1>
        {productInfoData[search]?.content && (
          <div className={isMobile ? 'textBody2' : 'textBody1'}>
            <div dangerouslySetInnerHTML={{ __html: productInfoData[search].content }} />
          </div>
        )}
      </div>

      {filterProducts.length >= 1 ? (
        <p className="textBody2 text-secondary">
          共 {filterProducts.length} 項 <span className="text-primary">{search}</span> 商品
        </p>
      ) : (
        <p className="textBody2 text-secondary">
          <span className="text-primary">{search}</span>{' '}
          分類中找不到指定主題產品，換個搜尋主題試試！
        </p>
      )}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3">
        {filterProducts?.map((product) => (
          <div className="col mb-5" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default SearchProductResult;
