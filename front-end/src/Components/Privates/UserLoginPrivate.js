import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/authContext";

export default function UserLoginPrivate({ children }) {
    const authContext = useContext(AuthContext);

    return (
        <>
        {authContext.isLoggedIn === true ? (
            <>{children}</>
        ) : (
            <>
                <h1>برای دسترسی به این مسیر ابتدا باید وارد شوید</h1>
                <div><Link to={"/login"}>برگشت به صفحه ورود</Link></div>
                <div><Link to={"/"}>برگشت به صفحه اصلی</Link></div>
            </>
        )}
        </>
    );

}
