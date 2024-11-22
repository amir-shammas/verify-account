import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "./../../context/authContext";

export default function AdminPanelPrivate({ children }) {
    const authContext = useContext(AuthContext);

    return (
        <>
        {authContext.userInfos.role === "ADMIN" ? (
            <>{children}</>
        ) : (
            <>
                <h1>شما اجازه دسترسی به این مسیر را ندارید!!</h1>
                <Link to={"/"}>برگشت به صفحه اصلی</Link>
            </>
        )}
        </>
    );

}
