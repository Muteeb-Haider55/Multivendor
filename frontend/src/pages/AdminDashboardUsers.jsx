import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Layout/AdminSideBar";
import AdminAllUsers from "../components/Admin/AdminAllUsers.jsx";

const AdminDashboardUsers = () => {
  return (
    <div>
      <AdminHeader />
      <div className=" w-full flex">
        <div className="w-[70px] 800px:w-[330px]">
          <AdminSideBar active={6} />
        </div>
        <AdminAllUsers />
      </div>
    </div>
  );
};

export default AdminDashboardUsers;
