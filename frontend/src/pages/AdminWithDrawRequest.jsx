import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Layout/AdminSideBar";
import AllWithdrawRequest from "../components/Admin/AllWithdrawRequest.jsx";

const AdminWithDrawRequest = () => {
  return (
    <div>
      <AdminHeader />
      <div className=" w-full flex">
        <div className="w-[90px] 800px:w-[330px]">
          <AdminSideBar active={7} />
        </div>
        <AllWithdrawRequest />
      </div>
    </div>
  );
};

export default AdminWithDrawRequest;
