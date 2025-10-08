import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

import { MdOutlineDelete, MdOutlinePanoramaFishEye } from "react-icons/md";
import styles from "../../styles/styles";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";

const AdminAllProducts = () => {
  const [open, setOpen] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      await axios
        .get(`${server}/product/admin-all-products`, {
          withCredentials: true,
        })
        .then((res) => {
          setData(res.data.products);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    };
    fetchProducts();
  }, []);

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 150, flex: 0.7 },

    {
      field: "name",
      headerName: "name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "price",
      headerName: "Product Price",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "stock",
      headerName: " Stock",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "action1",
      headerName: "Preview",
      flex: 0.4,
      minWidth: 100,

      type: "text",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/products/${params.id}`}>
              <BsEye
                color="black"
                size={25}
                className="flex items-center justify-center ml-4"
              />
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.discountPrice,
        stock: item.stock,
        sold_out: item.sold_out,
      });
    });

  return (
    <div className=" w-full flex justify-center ">
      <div className="w-[95%]">
        <h3 className=" font-Poppins text-[22px] pb-1">All Products</h3>
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

export default AdminAllProducts;
