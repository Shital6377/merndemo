import Logout from "../pages/view/Logout";
// import Dashboard from "../pages/Dashboard";
import Login from "../pages/view/Login";
import ResetPassword from "../pages/view/ResetPassword";
import ChangePassword from "../pages/view/ChangePassword";
import Profile from "../pages/view/Profile";

import Customer from "../pages/view/customer/Index";
import DataCollection from "../pages/view/userDataCollection/Index";
// import CustomerForm from "../pages/view/customer/PageForm";

import Cms from "../pages/view/cms/Index";
import Notification from "../pages/view/notification/Index";

const routes = [

    {
        path: "/about",
        exact: true,
        auth: true,
        component: <Cms title="About" />
    },
    {
        path: "/my-user",
        exact: true,
        auth: true,
        component: <Customer title="my-user" />
    },
    {
        path: "/collection",
        exact: true,
        auth: true,
        component: <DataCollection title="collection" />
    },

    {
        path: "/logout",
        exact: true,
        auth: true,
        component: <Logout title="Logout" />
    },
    {
        path: "/profile",
        exact: true,
        auth: true,
        component: <Profile title="Profile" />
    },
    {
        path: "/change-password",
        exact: true,
        auth: true,
        component: <ChangePassword title="Change Password" />
    },
    // {
    //     path: "/dashboard",
    //     exact: true,
    //     auth: true,
    //     component: <Dashboard title="Dashboard" />
    // },
    {
        path: "/login",
        exact: true,
        auth: false,
        component: <Login title="login" />
    },
    {
        path: "/reset-password/:tokens",
        exact: true,
        auth: false,
        component: <ResetPassword title="Reset Password" />
    },
   
    // {
    //     path: "/",
    //     exact: true,
    //     auth: false,
    //     component: <Dashboard title="Dashboard" />
    // },
    {
        path: "/notification",
        exact: true,
        auth: true,
        component: <Notification title="notification" />
    }
]

export default routes;