import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Layout/AdminSideBar";
import AdminAllProducts from "../components/Admin/AdminAllProducts.jsx";

const AdminDashboardProductsPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className=" w-full flex">
        <div className="w-[70px] 800px:w-[330px]">
          <AdminSideBar active={4} />
        </div>
        <AdminAllProducts />
      </div>
    </div>
  );
};

export default AdminDashboardProductsPage;
