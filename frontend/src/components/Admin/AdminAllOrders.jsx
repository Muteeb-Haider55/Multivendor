import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";

import styles from "../../styles/styles";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { getAllOrdersofAdmin } from "../../redux/actions/order";

const AdminAllOrders = () => {
  const { adminOrders } = useSelector((state) => state.orders);

  const [open, setOpen] = useState(false);
  const [sellerId, setSellerId] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrdersofAdmin());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then((res) => {
        setOpen(false);
        toast.success(res.data.message);
      })
      .catch((error) => {
        setOpen(false);
        toast.error(error.response.data.message);
      });
    dispatch(getAllOrdersofAdmin());
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "order status",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "totalPrice",
      headerName: "totalPrice",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "address",
      headerName: "Shipping Address",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
  ];
  const row = [];

  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        status: item.status,

        totalPrice: item.totalPrice + " $",
        address: item.shippingAddress.address1 + item.shippingAddress.address1,
      });
    });

  return (
    <div className=" w-full flex justify-center ">
      <div className="w-[95%]">
        <h3 className=" font-Poppins text-[22px] pb-1">All Sellers</h3>
        <div className=" w-full min-h-[43vh] bg-white rounded">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
        {open && (
          <div className="w-full top-0 left-0 fixed z-[999] bg-[#2828287d] flex items-center justify-center h-screen font-Poppins">
            <div className="w-full 800px:w-[40%] h-[17vh] 800px:h-[25vh] bg-white rounded shadow justify-center p-4">
              <h4 className=" p-1 ">Are you sure to delete this Seller</h4>
              <div className=" flex  items-center 800px:justify-end justify-start m-4 ">
                <div
                  className={`${styles.button} !rounded-[4px] mr-2 !bg-gray-400 text-white w-[100px] !h-[45px]`}
                  onClick={() => setOpen(false)}
                >
                  Cencel
                </div>
                <div
                  className={`${styles.button} !rounded-[4px] !bg-red-500 mr-2 text-white w-[100px] !h-[45px]`}
                  onClick={() => handleDelete(sellerId)}
                >
                  Confirm
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAllOrders;
