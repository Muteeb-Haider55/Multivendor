import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersofAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellerforAdmin } from "../../redux/actions/seller";
import { getAllUserAdmin } from "../../redux/actions/user";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);

  const { adminSeller } = useSelector((state) => state.seller);
  const { adminOrders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getAllSellerforAdmin());
    dispatch(getAllOrdersofAdmin());

    setOrders(adminOrders);
  }, [dispatch]);

  const adminEarning =
    adminOrders &&
    adminOrders.reduce(
      (acc, item) => (acc + item.totalPrice * 0.1).toFixed(2),
      0
    );

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: "action",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];

  adminOrders &&
    adminOrders.forEach((order) => {
      row.push({
        id: order._id,
        itemsQty: order.cart.length,
        total: order.totalPrice + " $",
        status: order.status,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className=" w-full pt-5">
          <h3 className="font-Poppins text-[22px] pb-1 ">Overview</h3>

          <div className="w-full block 800px:flex items-center justify-between">
            <div className=" w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <AiOutlineMoneyCollect
                  size={30}
                  className="mr-2 fill-green-500"
                />
                <h3
                  className={`${styles.productTitle} !text-[16px]  leading-5 !font-[400] text-slate-600 `}
                >
                  Total Earning
                </h3>
              </div>
              <h5 className=" pt-2 pl-[36px] text-[22px] font-[500]">
                ${adminEarning}
              </h5>
            </div>

            <div className=" w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <MdBorderClear size={30} className="mr-2 fill-green-500" />
                <h3
                  className={`${styles.productTitle} !text-[16px]  leading-5 !font-[400] text-slate-600 `}
                >
                  All Sellers
                </h3>
              </div>
              <h5 className=" pt-2 pl-[36px] text-[22px] font-[500]">
                {" "}
                {adminSeller && adminSeller.length}
              </h5>
              <Link to={`/admin-sellers`}>
                <h5 className=" pt-5 pl-2 text-green-500">View Sellers</h5>
              </Link>
            </div>

            <div className=" w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <AiOutlineMoneyCollect
                  size={30}
                  className="mr-2 fill-green-500"
                />
                <h3
                  className={`${styles.productTitle} !text-[16px]  leading-5 !font-[400] text-slate-600 `}
                >
                  All Orders
                </h3>
              </div>
              <h5 className=" pt-2 pl-[36px] text-[22px] font-[500]">
                {adminOrders && adminOrders.length}
              </h5>
              <Link to={`/admin-orders`}>
                <h5 className=" pt-5 pl-2 text-green-500">View Orders</h5>
              </Link>
            </div>
          </div>
          <br />
          <h3 className=" font-Poppins text-[22px] pb-1">Latest Order</h3>
          <div className=" w-full min-h-[43vh] bg-white rounded">
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={4}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;
