import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Layout/AdminSideBar";
import AdminAllEvents from "../components/Admin/AdminAllEvents.jsx";

const AdminDashboardEventsPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className=" w-full flex">
        <div className="w-[70px] 800px:w-[330px]">
          <AdminSideBar active={5} />
        </div>
        <AdminAllEvents />
      </div>
    </div>
  );
};

export default AdminDashboardEventsPage;
