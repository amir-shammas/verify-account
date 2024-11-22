import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/authContext";

export default function UserBanPrivate({ children }) {
    const authContext = useContext(AuthContext);

    return (
        <>
        {!authContext.userInfos.isBan ? (
            <>{children}</>
        ) : (
            <>
                <h1>دسترسی شما محدود شده است !!</h1>
                <div><Link to={"/"}>برگشت به صفحه اصلی</Link></div>
            </>
        )}
        </>
    );

}