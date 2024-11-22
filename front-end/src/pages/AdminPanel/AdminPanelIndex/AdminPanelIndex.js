import React , {useContext} from "react";
import AuthContext from "./../../../context/authContext";


function AdminPanelIndex() {

  // return <div>پیشخوان</div>;
  
  const authContext = useContext(AuthContext);

  return (
    <>
      <div className="container-fluid" id="home-content">
        <div className="container">
          <div className="home-content-title">
            <div className="welcome">
              <div className="name">{authContext.userInfos.username} عزیز </div>
              <div>به پنل ادمین خوش آمدید !!</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

}

export default AdminPanelIndex;
