import React from "react";
import AdminHeader from "../components/Layout/AdminHeader.jsx";
import AdminSideBar from "../components/Layout/AdminSideBar.jsx";
import AdminDashboardMain from "../components/Admin/AdminDashboardMain.jsx";
const AdminDashboardPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className=" w-full flex">
        <div className="w-[70px] 800px:w-[300px]">
          <AdminSideBar active={1} />
        </div>
        <AdminDashboardMain />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
