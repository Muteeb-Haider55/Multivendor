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

const AdminAllEvents = () => {
  const [open, setOpen] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      await axios
        .get(`${server}/event/admin-all-events`, {
          withCredentials: true,
        })
        .then((res) => {
          setData(res?.data?.events);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    };
    fetchEvents();
  }, []);

  const columns = [
    { field: "id", headerName: "Events ID", minWidth: 150, flex: 0.7 },

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
            <Link to={`/products/${params.id}?isEvent=true`}>
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
        <h3 className=" font-Poppins text-[22px] pb-1">All Events</h3>
        <div className=" w-full min-h-[43vh] bg-white rounded">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAllEvents;
