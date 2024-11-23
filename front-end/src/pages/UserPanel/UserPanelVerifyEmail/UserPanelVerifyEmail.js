import React, { useContext , useState , useEffect } from "react";
import swal from "sweetalert";
import AuthContext from "../../../context/authContext";
import { useParams } from "react-router-dom";

import "./UserPanelVerifyEmail.css";

function UserPanelVerifyEmail() {

    //   return <div>UserPanelSendLinkForVerifyEmail</div>;

    const token = useParams().token;

    const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

    const authContext = useContext(AuthContext);

    const [isEmailVerified, setIsEmailVerified] = useState(authContext.userInfos.isEmailVerified)

    const verifyEmail = async () => {
        try{
    
          fetch(`http://localhost:4000/users/verify-email/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${loggedInUser.token}`,
              },
          })
    
          .then((res) => {
              if(!res.ok){
                swal({
                  title: "توکن منقضی شده است",
                  icon: "error",
                  buttons: "متوجه شدم",
                });
                throw new Error('token expired !');
              }else{
                setIsEmailVerified(true);
                return res.json()
                .then(() => {
                  // Fetch verified user information
                  return fetch("http://localhost:4000/auth/me", {
                    headers: {
                      "Authorization": `Bearer ${loggedInUser.token}`,
                    },
                  });
                })
                .then((res) => {
                  if (!res.ok) throw new Error('Failed to verify user email!');
                  return res.json();
                })
                .then((verifiedUser) => {
                  // Update the global context with new user information
                  authContext.login(verifiedUser, loggedInUser.token);
                })
              }
            })

        }catch(error){
          swal({
            title: "عملیات انجام نشد",
            icon: "error",
            buttons: "تلاش دوباره",
          });
        }
      }

      useEffect(() => {
        verifyEmail();
      }, []);

    return (
        <>
            {
              isEmailVerified ?
              (<section className="login-register">
                  <div className="login">
                      <span className="login__title pt-20">ایمیل شما با موفقیت تایید شد</span>
                  </div>
              </section>) :
              (<section className="login-register">
                  <div className="login">
                      <span className="login__title">متاسفانه ایمیل شما تایید نشد</span>
                      <div className="login__new-member">
                          <span className="login__new-member-text">لطفا دوباره تلاش نمایید</span>
                      </div>
                  </div>
              </section>)
            }

        </>
    );

}

export default UserPanelVerifyEmail;
