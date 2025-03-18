import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layout/FrontLayout";
import Home from "../views/front/Home";
import Login from "../views/front/Login";
import AdminLayout from "../layout/AdminLayout";
import AdminProduct from "../views/admin/AdminProduct";
import NotFound from "../views/front/NotFound";
import ProductList from "../views/front/ProductList";
import Cart from "../views/front/Cart";
import AdminOrder from "../views/admin/AdminOrder";
import ProductDetail from "../views/front/ProductDetail";
import About from "../views/front/About";
import AdminCoupon from "../views/admin/AdminCoupon";
import AdminSingleOrder from "../views/admin/AdminSingleOrder";
import SearchProductResult from "../views/front/SearchProductResult";
import ProductLayout from "../layout/ProductLayout";

const router = createHashRouter([
    {
        path: '/',
        element: <FrontLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'productList',
                element: <ProductLayout />,
                children: [
                    {
                        path: "all",
                        element: <ProductList />
                    },
                    {
                        path: "search/:search",
                        element: <SearchProductResult />
                    }
                ]
            },
            {
                path: 'productList/:id',
                element: <ProductDetail />
            },
            {
                path: 'cart',
                element: <Cart />
            },
            {
                path: 'about',
                element: <About />
            },
            
            
        ]
    },
    {
        path: 'login',
        element: <Login />
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                path: "product",
                element: <AdminProduct />
            },
            {
                path: "order",
                element: <AdminOrder />
            },
            {
                path: "order/:id",
                element: <AdminSingleOrder />
            },
            {
                path: "coupon",
                element: <AdminCoupon />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

export default router;