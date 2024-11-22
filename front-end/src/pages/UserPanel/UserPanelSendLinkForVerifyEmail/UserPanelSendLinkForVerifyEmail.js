import React, { useContext , useState , useEffect } from "react";
import swal from "sweetalert";
import AuthContext from "../../../context/authContext";

import "./UserPanelSendLinkForVerifyEmail.css";

function UserPanelSendLinkForVerifyEmail() {

    //   return <div>UserPanelSendLinkForVerifyEmail</div>;

    const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

    const authContext = useContext(AuthContext);

    const [isEmailVerified, setIsEmailVerified] = useState(authContext.userInfos.isEmailVerified)

    const sendLinkForVerifyEmail = async (e) => {
        try{
    
          e.preventDefault();

          if(authContext.userInfos.isBan){
            swal({
              title: "دسترسی شما محدود شده است",
              icon: "error",
              buttons: "متوجه شدم",
            });
            return;
          }
    
          fetch("http://localhost:4000/users/send-link-for-verify-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${loggedInUser.token}`,
              },
          })
    
          .then((res) => {
              if(!res.ok){
                swal({
                  title: "خطایی در ارسال لینک تایید رخ داده است",
                  icon: "error",
                  buttons: "متوجه شدم",
                    });
                throw new Error('error in sending link occured !');
              }else{
                return res.json()
                .then(() => {
                    swal({
                    title: "لینک تایید به ایمیل شما ارسال شد",
                    icon: "success",
                    buttons: "باشه",
                    });
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
      setIsEmailVerified(authContext.userInfos.isEmailVerified);
    }, [authContext.userInfos.isEmailVerified])

    return (
        <>

            {
                isEmailVerified ?
                (<section className="login-register">
                    <div className="login">
                        <span className="login__title pt-20">ایمیل شما تایید شده است</span>
                    </div>
                </section>) :
                (<section className="login-register">
                    <div className="login">
                        <span className="login__title">ارسال لینک تایید ایمیل</span>
                        <div className="login__new-member">
                            <span className="login__new-member-text">لطفا برای ارسال لینک روی دکمه زیر کلیک نمایید</span>
                        </div>
                        <form className="login-form" onSubmit={sendLinkForVerifyEmail}>
                        <button
                            type="submit"
                            className="login-form__btn login-form__btn-success"
                            >
                            <span className="login-form__btn-text">ارسال لینک تایید ایمیل</span>
                        </button>
                        </form>
                    </div>
                </section>)
            }

            

        </>
    );

}

export default UserPanelSendLinkForVerifyEmail;
