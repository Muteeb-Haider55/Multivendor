import React from "react";
import { useSelector } from "react-redux";
import { backend_url } from "../../../server";
import logo from "../../assets/logo123.png";
import { Link } from "react-router-dom";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className=" w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div className=" ml-5">
        <Link to="/">
          <img src={logo} alt="" height={50} width={55} />
        </Link>
      </div>
      <div className="flex item-center">
        <div className="flex item-center mr-4 mt-3">
          <Link to="/dashboard-coupouns" className="800px:block hidden">
            <AiOutlineGift color="#555" size={30} className="cursor-pointer" />
          </Link>
          <Link to="/dashboard-events" className="800px:block hidden">
            <MdOutlineLocalOffer
              color="#555"
              size={30}
              className="cursor-pointer ml-4"
            />
          </Link>
          <Link to="/dashboard-products" className="800px:block hidden">
            <FiShoppingBag
              color="#555"
              size={30}
              className=" cursor-pointer ml-4"
            />
          </Link>
          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiPackage
              color="#555"
              size={30}
              className=" cursor-pointer ml-4"
            />
          </Link>
          <Link to="/dashboard-messages" className="800px:block hidden">
            <BiMessageSquareDetail
              color="#555"
              size={30}
              className=" cursor-pointer ml-4"
            />
          </Link>

          <img
            src={`${backend_url}/${user?.avatar.public_id}`}
            alt=""
            className=" w-[40px] h-[40px] rounded-full ml-5"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
