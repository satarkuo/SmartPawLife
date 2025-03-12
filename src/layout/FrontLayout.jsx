import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import logoHeader from '../assets/img/front/LogoHeader.svg';
import useScreenSize from '../hooks/useScreenSize';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartData } from '../redux/cartSlice';
import { ToastAlert } from '../utils/sweetAlert';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../assets/front.scss';


const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const routesNav = [
    {path: '/', name: '首頁'},
    {path: '/productList', name: '智能產品'},
    {path: '/about', name: '關於SmartPaw Life'},
]
const routesLinks = [
    {path: '/cart', name: '購物車', icon: 'shopping_cart', newTab: false},
    {path: '/login', name: '登入管理', icon: 'person', newTab: true}
]

const FrontLayout = () => {
    //navbar for rwd
    const [isNavOpen, setIsNavOpen] = useState(false);
    const { screenWidth } = useScreenSize();
    const toggleNavbar = () => {
        if (screenWidth <= 767) {
            setIsNavOpen(!isNavOpen); 
        }
    };

    //取得購物車API資料
    const dispatch = useDispatch({})
    const getCartList = async() => {
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
            dispatch(updateCartData(res.data.data))
        } catch (error) {
            ToastAlert.fire({
                icon: "error",
                title: "取得購物車失敗",
                text: error
            });
        }
    }
    useEffect(() => {
        getCartList();
    },[])

    //取得儲存的購物車
    const carts = useSelector(state => state.cart.carts)

    //scroll to top
    const { pathname, search } = useLocation();
    useEffect(() => {
        window.scrollTo({ 
            top: 0, 
            behavior: "smooth"
        });
    }, [pathname, search]) //監聽 pathname 和 ?page= 換頁變化

    return (
    <>
        <header className="frontHeader fixed-top">
            <nav className="navbar navbar-expand-md mainNav">
                <div className="container">
                    <Link to="/" className="navbar-brand me-5" href="#">
                        <img src={logoHeader} alt="logo"/>
                    </Link>
                    <span className="navbar-toggler border-0"  onClick={toggleNavbar} >
                        <span className="material-icons align-content-center me-1 fs-5">
                            {isNavOpen === true ? 'close' : 'menu'}
                        </span>
                    </span>
                    <div className={`collapse navbar-collapse ${isNavOpen === true && 'show'}`} id="navbarToggler">
                        <ul className="nav navbar-nav d-flex justify-content-end w-100 gap-3">
                            {routesNav.map( route => (
                                <li className="nav-item" key={route.path}>
                                    <NavLink to={route.path} 
                                        className="nav-link px-2"
                                        onClick={toggleNavbar}
                                        >{route.name}</NavLink>
                                </li>
                            ))}
                            {routesLinks.map(route => (
                                <li className="nav-item" key={route.path}>
                                    <NavLink to={route.path} 
                                        className="nav-link px-2 d-flex align-items-center justify-content-center"
                                        onClick={toggleNavbar}
                                        key={route.path}
                                        {...(route.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} >
                                        {route.name === '購物車' ? (
                                            <div className="position-relative">
                                                <i className="fas fa-shopping-cart"></i>
                                                <span
                                                    className="position-absolute badge text-bg-primary rounded-pill text-white"
                                                    style={{
                                                    bottom: "6px",
                                                    left: "10px",
                                                    }}
                                                >{carts.length}</span>
                                            </div>
                                        ): ''}
                                        <span className="material-icons align-content-center me-1 fs-5 ">{route.icon} </span>
                                        {isNavOpen === true && route.name}
                                        
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                </div>
            </nav>
        </header>
        
        <div className="contentAll">
            <Outlet />
        </div>
    </>
    )
}
export default FrontLayout;