import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Layout/AdminSideBar";
import AdminAllOrders from "../components/Admin/AdminAllOrders.jsx";

const AdminDashoardOrdersPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className=" w-full flex">
        <div className="w-[70px] 800px:w-[330px]">
          <AdminSideBar active={2} />
        </div>
        <AdminAllOrders />
      </div>
    </div>
  );
};

export default AdminDashoardOrdersPage;
