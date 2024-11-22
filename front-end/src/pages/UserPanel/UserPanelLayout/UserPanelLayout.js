import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./../../../Components/User/Topbar/Topbar";
import Navbar from "./../../../Components/User/Navbar/Navbar";
import UserPanelSidebar from "./../../../Components/UserPanel/UserPanelSidebar/UserPanelSidebar";

import "./UserPanelLayout.css";


function UserPanelLayout() {

    return (
        <>
          <Topbar />
          <Navbar />
  
          <section className="content">
              <div className="content-header">
                  <div className="container">
                      <span className="content-header__title">حساب کاربری من</span>
                  </div>
              </div>
              <div className="content-main">
                  <div className="container">
                      <div className="row">
                        
                          <UserPanelSidebar />
  
                          {/* <Outlet /> */}

                          <div className="col-9">
                            <Outlet />
                          </div>
  
                      </div>
                  </div>
              </div>
          </section>
        </>
    )

}

export default UserPanelLayout;
