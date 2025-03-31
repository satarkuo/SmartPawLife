import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleFavoriteList } from '../redux/favoriteListSlice';

const ProductCard = ({ product }) => {
  // toggle favorite
  const dispatch = useDispatch();
  const favoriteList = useSelector((state) => state.favorite.favoriteList);

  const toggleFavorite = (e, id) => {
    e.preventDefault(); // 取消 a 連結
    e.stopPropagation(); // 取消觸發 <Link> 導航行為
    dispatch(toggleFavoriteList(id));
  };

  return (
    <Link to={`/productList/${product.id}`} className="h-100 w-100">
      <div className="productCard">
        <div className="tagBox">
          {product.is_newest && (
            <span className="tag textBody3 bg-info">
              <span className="material-icons textBody2 me-1">verified</span>
              新品
            </span>
          )}
          {product.is_hottest && (
            <span className="tag textBody3">
              <span className="material-icons textBody2 me-1">local_fire_department</span>
              TOP
            </span>
          )}
          {product.origin_price > product.price && (
            <span className="tag textBody3 bg-primary">
              <span className="material-icons textBody2 me-1">timer</span>
              限時優惠
            </span>
          )}
        </div>
        <span
          className={`material-icons favoriteBtn ${favoriteList[product.id] && 'active'}`}
          onClick={(e) => toggleFavorite(e, product.id)}
        ></span>
        <img className="img-fluid round-top" src={product.imageUrl} alt={product.title} />
        <div className="card-body">
          <p className="card-title h5 m-0">{product.title}</p>
          <p className="card-text textBody2">{product.description}</p>
        </div>
        <div className="card-footer">
          <div className="textBody2 text-primary">$ {product.price.toLocaleString()}</div>
          {product.origin_price > product.price && (
            <del className="textBody3 text-body-tertiary align-self-center">
              $ {product.origin_price.toLocaleString()}
            </del>
          )}
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;
ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};
