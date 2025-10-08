import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../../server";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { AiOutlineEye } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";

const AllWithdrawRequest = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawdata, setWithdrawData] = useState([]);
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-requests`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response.data.message);
      });
  }, []);
  console.log(data);
  const columns = [
    { field: "id", headerName: "Withdraw Id", minWidth: 150, flex: 0.7 },
    { field: "shopId", headerName: "Shop Id", minWidth: 150, flex: 0.7 },

    { field: "name", headerName: " Shop Name", minWidth: 180, flex: 1.4 },
    { field: "amount", headerName: "amount", minWidth: 100, flex: 0.6 },
    { field: "status", headerName: "status ", minWidth: 80, flex: 0.5 },
    {
      field: "createdAt",
      headerName: "Request Given At",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "",
      headerName: "Update Status",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => {
        return (
          <Button>
            <BiSolidPencil
              className={`${
                params.row.status !== "Processing" ? "hidden" : "block"
              } mr-5 cursor-pointer`}
              size={20}
              onClick={() => setOpen(true) || setWithdrawData(params.row)}
            />
          </Button>
        );
      },
    },
  ];
  const row = [];
  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        shopId: item.seller._id,
        name: item.seller.name,
        amount: "US$ " + item.amount,
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      });
    });
  const handleSubmit = async () => {
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawdata.id}`,
        { sellerId: withdrawdata.shopId },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        toast.success("Status updates successfully");

        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="w-full flex items-center justify-center pt-5">
      <div className="w-[95%] bg-white">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      {open && (
        <div className="w-full h-screen fixed top-0 left-0  bg-[#0000004e] z-[9999] flex items-center justify-center">
          <div className="800px:w-[50%] w-[80%] min-h-[80vh] 800px:min-h-[40vh] bg-white  rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1 size={25} onClick={() => setOpen(false)} />{" "}
            </div>
            <h1 className="font-Poppins pb-5 text-[23px] text-center">
              Update Withdraw Status
            </h1>
            <select
              name=""
              onChange={(e) => setWithdrawStatus(e.target.value)}
              className=" w-[230px] border rounded mt-8 h-[50px]"
            >
              <option value={withdrawStatus}>{withdrawdata.status}</option>
              <option value={withdrawStatus}>Succeed</option>
            </select>
            <button
              type="submit"
              className={`${styles.button} !rounded-[4px]`}
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdrawRequest;
