import Index from "./pages/User/Index/Index";
import Login from "./pages/User/Login/Login";
import Register from "./pages/User/Register/Register";
import UserPanelLayout from "./pages/UserPanel/UserPanelLayout/UserPanelLayout";
import AdminPanelLayout from "./pages/AdminPanel/AdminPanelLayout/AdminPanelLayout";
import AdminPanelPrivate from "./Components/Privates/AdminPanelPrivate";
import UserLoginPrivate from "./Components/Privates/UserLoginPrivate";
// import UserBanPrivate from "./Components/Privates/UserBanPrivate";
import UserPanelIndex from "./pages/UserPanel/UserPanelIndex/UserPanelIndex"
import UserPanelEditAccount from "./pages/UserPanel/UserPanelEditAccount/UserPanelEditAccount";
import UserPanelChangePassword from "./pages/UserPanel/UserPanelChangePassword/UserPanelChangePassword";
import AdminPanelIndex from "./pages/AdminPanel/AdminPanelIndex/AdminPanelIndex";
import AdminPanelUsers from "./pages/AdminPanel/AdminPanelUsers/AdminPanelUsers";
import ForgetPassword from "./pages/User/ForgetPassword/ForgetPassword";
import ResetPassword from "./pages/User/ResetPassword/ResetPassword";


const routes = [
  { path: "/", element: <Index /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forget-password", element: <ForgetPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },

  { path: "/my-account/*",
    element: (
      <UserLoginPrivate>
        {/* <UserBanPrivate> */}
          <UserPanelLayout />
        {/* </UserBanPrivate> */}
      </UserLoginPrivate>
    ),
    children: [
      {path: "", element: <UserPanelIndex />},
      {path: "edit-account", element: <UserPanelEditAccount />},
      {path: "change-password", element: <UserPanelChangePassword />},
    ],
   },

  { path: "/admin-panel/*",
    element: (
      <AdminPanelPrivate>
        <AdminPanelLayout />
      </AdminPanelPrivate>
    ),
    children: [
      {path: "", element: <AdminPanelIndex />},
      {path: "users", element: <AdminPanelUsers />},
    ]
   },
];

export default routes;
