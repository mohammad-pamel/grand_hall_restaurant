import { createBrowserRouter } from "react-router";
import RootLayout from './../Layouts/RootLayout';
import Home from './../Pages/Home/Home/Home';
import FoodDetails from './../Pages/Home/FoodDetails/FoodDetails';
import AllFoods from './../Pages/Home/All-Foods/All-Foods';
import Login from './../Pages/Auth/Login/Login';
import Register from './../Pages/Auth/Register/Register';
import AuthLayout from "../Layouts/AuthLayouts";
import DashboardLayout from "../Layouts/DashboardLayouts";
import AddFood from "../Pages/Dashboard/Add-Food/Add-Food";
import ManageFoods from "../Pages/Dashboard/ManageFoods/ManageFoods";
import MyProfile from "../Pages/Dashboard/My-Profile/My-Profile";
import ManageOrders from "../Pages/Dashboard/Manage-Orders/Manage-Orders";
import AllUsers from "../Pages/Dashboard/AllUsers/AllUsers";
import MyOrders from '../Pages/Home/My-Orders/My-Orders';
import AdminRoute from "./AdminRoute";
import UserRoute from "./UserRoute";
import AboutUs from './../Pages/Home/AboutUs/AboutUs';
import PrivateRoute from "./PrivateRoute";
import Cart from "../Pages/Home/Cart/Cart";
import Checkout from "../Pages/Home/Checkout/Checkout";
import Payment from "../Pages/Home/Payment/Payment";
import paymentSuccess from "../Pages/Home/Payment/PaymentSuccess";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      // {
      //   path: 'coverage',
      //   Component: Coverage,
      //   loader: () => fetch('/serviceCenter.json')
      // },
      {
        path: 'all-foods',
        Component: AllFoods
      },
      {
        path: 'food-details/:id',
        Component: FoodDetails,
        // loader: () => fetch('/serviceCenter.json')
      },
      {
        path: 'my-orders',
        // element: (
        //   <PrivateRoute>
        //     <MyOrders />
        //   </PrivateRoute>
        // )
        element: <UserRoute><MyOrders></MyOrders></UserRoute>
      },
      {
        path: 'cart',
        Component: Cart
      },
      {
        path: 'checkout',
        Component: Checkout
      },
      {
        path: 'about-us',
        Component: AboutUs
      },
      {
        path: 'paymentBkash',
        Component: Payment
      },
      {
        path: 'payment-success/:id',
        Component: paymentSuccess
      }
    ]
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register
      },
    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    // element: <DashboardLayout></DashboardLayout>,
    children: [
      {
        path: 'add-food',
        element: <AdminRoute><AddFood></AddFood></AdminRoute>,
        // loader: () => fetch('/serviceCenter.json')
      },
      {
        path: 'manage-orders',
        element: <AdminRoute><ManageOrders></ManageOrders></AdminRoute>
      },
      {
        path: 'all-users',
        element: <AdminRoute><AllUsers></AllUsers></AdminRoute>
        // loader: () => axios.get('http://localhost:3000/users')
      },
      {
        path: 'manage-foods',
        element: <AdminRoute><ManageFoods></ManageFoods></AdminRoute>
      },
      {
        path: 'my-profile',
        element: <AdminRoute><MyProfile></MyProfile></AdminRoute>
      },
      //     {
      //       path: 'payments',
      //       element: <UserRoute><Payments></Payments></UserRoute>
      //     },
      //     {
      //       path: 'payment-success',
      //       element: <UserRoute><PaymentSuccess></PaymentSuccess></UserRoute>
      //     },
      //     {
      //       path: 'payment-cancelled',
      //       element: <UserRoute><PaymentCancelled></PaymentCancelled></UserRoute>
      //     }
    ]
  },
  {
    path: '*',
    Component: Error
  },
]);