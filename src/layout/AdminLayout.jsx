import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logoHeader from '../assets/img/admin/LogoHeader.svg';
import { ToastAlert } from '../utils/sweetAlert';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../redux/toastSlice';

const { VITE_BASE_URL: BASE_URL } = import.meta.env;

const routesNav = [
  { path: '/admin/product', name: '產品管理' },
  { path: '/admin/order', name: '訂單管理' },
  { path: '/admin/coupon', name: '優惠券管理' },
];

const AdminLayout = () => {
  const [isScreenLoading, setIsScreenLoading] = useState(false); //全螢幕Loading
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //驗證登入狀態:儲存token
  useEffect(() => {
    const token = document.cookie.replace(/(?:^|;\s*)apiToken\s*=\s*([^;]*).*$|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;
    (async () => {
      await checkLogin();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //驗證登入狀態
  const checkLogin = async () => {
    try {
      await axios.post(`${BASE_URL}/api/user/check`);
    } catch (error) {
      dispatch(
        pushMessage({
          title: '失敗',
          text: error.response.data.message,
          type: 'danger',
        })
      );
      setTimeout(() => {
        //replace: 驗證失敗時，不提供返回上頁頁面
        navigate('/login', { replace: true });
      }, 0);
    }
  };
  //登出
  const handleLogout = async () => {
    setIsScreenLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/logout`);
      document.cookie =
        'apiToken=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/SmartPawLife'; //清除cookie 中的 token
      ToastAlert.fire({
        icon: 'success',
        title: '帳號已登出',
        text: res.data.message,
      });
      navigate('/login');
    } catch (error) {
      ToastAlert.fire({
        icon: 'error',
        title: '登出失敗',
        text: error.response.data.message,
      });
    } finally {
      setIsScreenLoading(false);
    }
  };

  //scroll to top
  const adminContentRef = useRef(null);
  const { pathname, search } = useLocation();
  useEffect(() => {
    if (adminContentRef.current) {
      adminContentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [pathname, search]); //監聽 pathname 和 ?page= 換頁變化

  return (
    <div className="adminLayout">
      <header className="adminHeader fixed-left border-bottom pb-3">
        <div className="d-flex flex-column h-100">
          <Link to="/admin/product" className="d-flex align-items-center text-decoration-none p-4">
            <img src={logoHeader} alt="logo" />
          </Link>
          <ul className="nav flex-column flex-fill w-100">
            {routesNav.map((route) => (
              <li key={route.path}>
                <NavLink
                  to={route.path}
                  className="nav-link px-4 py-3 w-100 d-flex align-items-center"
                >
                  <span className="flex-fill">{route.name}</span>
                  <span className="material-icons align-content-center ms-1 ">arrow_forward </span>
                </NavLink>
              </li>
            ))}
          </ul>
          {/* <Link to="/" className="nav-link px-2 link-secondary">返回前台首頁</Link> */}
          <button
            type="button"
            className="btn btn-primary mx-3 d-flex align-items-center justify-content-center"
            onClick={() => handleLogout()}
          >
            登出<span className="material-icons align-content-center ms-1 ">logout </span>
          </button>
        </div>
      </header>
      <div className="adminContent" ref={adminContentRef}>
        <Outlet />
      </div>

      {isScreenLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(230,146,112,0.7)',
            zIndex: 1999,
          }}
        >
          <ReactLoading type="spin" color="#fff" width="4rem" height="4rem" />
        </div>
      )}
    </div>
  );
};
export default AdminLayout;
