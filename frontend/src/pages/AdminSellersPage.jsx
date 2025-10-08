import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Layout/AdminSideBar";
import AdminAllSellers from "../components/Admin/AdminAllSellers.jsx";

const AdminSellersPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className=" w-full flex">
        <div className="w-[70px] 800px:w-[330px]">
          <AdminSideBar active={3} />
        </div>
        <AdminAllSellers />
      </div>
    </div>
  );
};

export default AdminSellersPage;
