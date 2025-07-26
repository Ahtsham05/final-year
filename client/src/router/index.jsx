import {createBrowserRouter} from "react-router-dom"
import App from "../App"
import Home from "../pages/Home"
import Search from "../pages/Search"
import Register from "../pages/Register"
import Login from "../pages/Login"
import ForgetPassword from "../pages/ForgetPassword"
import VerifyOtp from "../pages/VerifyOtp"
import ResetPassword from "../pages/ResetPassword"
import MobileUserMenu from "../pages/MobileUserMenu"
import Dashboard from "../layout/Dashboard"
import UpdateUserProfile from "../pages/UpdateUserProfile"
import Category from "../pages/Category"
import SubCategory from "../pages/SubCategory"
import UploadProduct from "../pages/UploadProduct"
import AdminPage from "../layout/AdminPage"
import AdminProduct from "../pages/AdminProduct"
import ProductListPage from "../pages/ProductListPage"
import ProductDisplayPage from "../pages/ProductDisplayPage"
import MobileCart from "../pages/MobileCart"
import CheckoutPage from "../pages/CheckoutPage"
import Address from "../pages/Address"
import CancelPage from "../pages/CancelPage"
import SuccessPage from "../pages/SuccessPage"

const router = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {
                path:"",
                element:<Home/>
            },
            {
                path:"search",
                element:<Search />
            },
            {
                path:"register",
                element:<Register/>
            },
            {
                path:"login",
                element:<Login/>
            },
            {
                path:"forget-password",
                element:<ForgetPassword/>
            },
            {
                path:"verify-otp",
                element:<VerifyOtp/>
            },
            {
                path:"reset-password",
                element:<ResetPassword/>
            },
            {
                path:"user",
                element:<MobileUserMenu/>
            },
            {
                path:"dashboard",
                element:<Dashboard/>,
                children:[
                    {
                        path:"profile",
                        element:<UpdateUserProfile/>
                    },
                    {
                        path:"category",
                        element:<AdminPage>
                                    <Category/>
                                </AdminPage>
                    },
                    {
                        path:"subcategory",
                        element:<AdminPage>
                                    <SubCategory/>
                                </AdminPage>
                    },
                    {
                        path:"product",
                        element:<AdminPage>
                                    <UploadProduct/>
                                </AdminPage>
                    },
                    {
                        path:"adminproduct",
                        element:<AdminPage>
                                    <AdminProduct/>
                                </AdminPage>
                    },
                    {
                        path:"address",
                        element:<Address/>
                    }
                ]
            },
            {
                path:":category",
                element:"",
                children:[
                    {
                        path:":subcategory",
                        element:<ProductListPage/>
                    }
                ]

            },
            {
                path:"product",
                element:"",
                children:[
                    {
                        path:":product",
                        element:<ProductDisplayPage/>
                    }
                ]
            },
            {
                path:"cart",
                element:<MobileCart/>
            },
            {
                path:"checkout",
                element:<CheckoutPage/>
            },
            {
                path:"success",
                element:<SuccessPage/>
            },
            {
                path:"cancel",
                element:<CancelPage/>
            }
        ]
    }
])

export default router