import React from "react";
import { Outlet } from "react-router-dom";

import "./AdminPanelLayout.css"
import AdminPanelSidebar from "./../../../Components/AdminPanel/AdminPanelSidebar/AdminPanelSidebar";
import AdminPanelTopbar from "./../../../Components/AdminPanel/AdminPanelTopbar/AdminPanelTopbar";


function AdminPanelLayout() {
  return (
    <>
      <div id="content">
        <AdminPanelSidebar />

        <div id="home" className="col-10">
          <AdminPanelTopbar />

          <div className="container-fluid" id="home-content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPanelLayout;
