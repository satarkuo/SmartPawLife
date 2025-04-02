import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logoHeader from '../assets/img/front/LogoHeader.svg';
import useScreenSize from '../hooks/useScreenSize';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartData } from '../redux/cartSlice';
import { ToastAlert } from '../utils/sweetAlert';

import fb from '../assets/img/front/icon-fb.svg';
import ig from '../assets/img/front/icon-ig.svg';
import line from '../assets/img/front/icon-line.svg';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { setSearchValue } from '../redux/searchSlice';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const routesNav = [
  //{ path: '/', name: '首頁' },
  { path: '/productList/all', name: '智能產品' },
  { path: '/about', name: '關於SmartPaw Life' },
];
const routesLinks = [
  { path: '/favorite', name: '收藏清單', icon: 'favorite', newTab: false },
  { path: '/cart', name: '購物車', icon: 'shopping_cart', newTab: false },
  //{ path: '/login', name: '登入管理', icon: 'person', newTab: true },
];
const routesSocialMediaLinks = [
  { path: '/', name: 'FB', icon: fb, newTab: true },
  { path: '/', name: 'IG', icon: ig, newTab: true },
  { path: '/', name: 'LINE', icon: line, newTab: true },
];

const FrontLayout = () => {
  //navbar for rwd
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { screenWidth } = useScreenSize();
  const toggleNavbar = () => {
    if (screenWidth <= 767) {
      setIsNavOpen(!isNavOpen);
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //取得購物車API資料
  const getCartList = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      dispatch(updateCartData(res.data.data));
    } catch (error) {
      ToastAlert.fire({
        icon: 'error',
        title: '取得購物車失敗',
        text: error,
      });
    }
  };

  useEffect(() => {
    getCartList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //取得儲存的購物車
  const carts = useSelector((state) => state.cart.carts);

  //scroll to top
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname, search]); //監聽 pathname 和 ?page= 換頁變化

  //RTK取得：搜尋關鍵字
  const searchValue = useSelector((state) => state.search.searchValue);

  // input：儲存關鍵字
  const handleInputChange = (e) => {
    const { value } = e.target;
    dispatch(setSearchValue(value));
  };

  // input：送出搜尋關鍵字
  const handleFilterProducts = () => {
    toggleNavbar();
    if (searchValue !== '') {
      navigate(`/productList/search/${searchValue}`, { state: { from: 'allPagesSearch' } });
    } else {
      ToastAlert.fire({
        icon: 'error',
        title: '請先輸入搜尋關鍵字',
      });
    }
  };

  return (
    <>
      <header className="frontHeader fixed-top">
        <nav className="navbar navbar-expand-md mainNav">
          <div className="container">
            <Link to="/" className="navbar-brand" href="#">
              <img src={logoHeader} alt="logo" />
            </Link>
            <span className="navbar-toggler border-0" onClick={toggleNavbar}>
              <span className="material-icons align-content-center me-1 fs-5">
                {isNavOpen === true ? 'close' : 'menu'}
              </span>
            </span>
            <div
              className={`collapse navbar-collapse ${isNavOpen === true && 'show'}`}
              id="navbarToggler"
            >
              <ul className="nav navbar-nav d-flex justify-content-end w-100 gap-3">
                {routesNav.map((route) => (
                  <li className="nav-item" key={route.path}>
                    <NavLink to={route.path} className="nav-link px-2" onClick={toggleNavbar}>
                      {route.name}
                    </NavLink>
                  </li>
                ))}
                {routesLinks.map((route) => (
                  <li className="nav-item" key={route.path}>
                    <NavLink
                      to={route.path}
                      className="nav-link px-2 d-flex align-items-center justify-content-center"
                      onClick={toggleNavbar}
                      {...(route.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {route.name === '購物車'
                        ? carts.length >= 1 && (
                            <div className="position-relative">
                              <span
                                className="position-absolute badge text-bg-primary rounded-pill text-white"
                                style={{
                                  bottom: '6px',
                                  left: '10px',
                                }}
                              >
                                {carts.length}
                              </span>
                            </div>
                          )
                        : ''}
                      <span className="material-icons align-content-center me-1 fs-5 ">
                        {route.icon}{' '}
                      </span>
                      {isNavOpen === true && route.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className={`searchBar mt-3 mt-md-0 ms-md-3 ${searchValue ? 'active' : ''}`}>
                <input
                  type="search"
                  placeholder="搜尋商品"
                  value={searchValue}
                  className="input px-3"
                  onChange={handleInputChange}
                />
                <button type="submit" className="btn btn-primary" onClick={handleFilterProducts}>
                  <span className="material-icons-outlined fs-5 align-self-center">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="contentAll">
        <Outlet />
      </div>

      <footer className="frontFooter bg-wave bg-wave4">
        <div className="container">
          <div className="row g-3 g-lg-5">
            <div className="col-lg-3 text-center text-lg-start">
              <Link to="/" className="navbar-brand" href="#">
                <img src={logoHeader} alt="logo" />
              </Link>
            </div>
            <div className="col-lg-6">
              <ul className="nav navbar-nav d-flex flex-md-row justify-content-center gap-3">
                {routesNav.map((route) => (
                  <li className="nav-item text-center" key={route.path}>
                    <Link to={route.path} className="nav-link px-2">
                      {route.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-3">
              <ul className="nav navbar-nav d-flex flex-row justify-content-center justify-content-lg-end gap-3">
                {routesSocialMediaLinks.map((route) => (
                  <li className="nav-item text-center" key={route.name}>
                    <Link
                      to={route.path}
                      className="nav-link p-0 d-flex justify-content-center align-items-center"
                      style={{ width: '24px', height: '24px' }}
                    >
                      <img src={route.icon} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col">
              <p className="textBody3 text-center copyright">
                SmartPaw Life股份有限公司：100 台北市中正區重慶南路一段 122 號<br />
                無商業用途且僅供作品展示 | 版權所有：© Copyright 2025 SmartPaw Life. All Rights
                Reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
export default FrontLayout;
