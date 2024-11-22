import React , {useContext} from "react";
import AuthContext from "./../../../context/authContext";

function AdminPanelTopbar() {

//   return <div>Admin-Panel-Topbar</div>;

const authContext = useContext(AuthContext);

return (
    <div className="container-fluid">
      <div className="container">
        <div
          className="home-header"
        >
          <div className="home-right">
            <div className="home-searchbar">
              <input type="text" className="search-bar" placeholder="جستجو..." />
            </div>
            <div className="home-notification">
              <button
                type="button"
              >
                <i className="far fa-bell"></i>
              </button>
            </div>
            <div
              className="home-notification-modal"
            >
              <ul className="home-notification-modal-list">
                <>
                  <li className="home-notification-modal-item">
                    نوتیفکیشنی برای نمایش وجود ندارد
                  </li>


                      <li className="home-notification-modal-item">
                        <span className="home-notification-modal-text">
                          notification-message
                        </span>
                        <label className="switch">
                          <a
                            href=""
                          >
                            دیدم
                          </a>
                        </label>
                      </li>

                  </>

              </ul>
            </div>
          </div>
          <div className="home-left">
            <div className="home-profile">
              <div className="home-profile-image">
                <a href="#">
                  <img src="./../../images/amir.jpg" alt="" />
                </a>
              </div>
              <div className="home-profile-name">
                <a href="#">{authContext.userInfos.username}</a>
              </div>
              <div className="home-profile-icon">
                <i className="fas fa-angle-down"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default AdminPanelTopbar;
