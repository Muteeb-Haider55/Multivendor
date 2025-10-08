import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllUserAdmin } from "../../redux/actions/user";
import { DataGrid } from "@mui/x-data-grid";

import { Button } from "@mui/material";

import { MdOutlineDelete } from "react-icons/md";
import styles from "../../styles/styles";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";

const AdminAllUsers = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const { adminUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUserAdmin());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
      .then((res) => {
        setOpen(false);
        toast.success(res.data.message);
      })
      .catch((error) => {
        setOpen(false);
        toast.error(error.response.data.message);
      });
    dispatch(getAllUserAdmin());
  };

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 150, flex: 0.7 },

    {
      field: "name",
      headerName: "name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "User Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "role",
      headerName: "User Role",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: "action",
      headerName: "Delete User",
      flex: 0.7,
      minWidth: 150,

      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => setUserId(params.id) || setOpen(true)}>
              <MdOutlineDelete color="black" size={25} />
            </Button>
          </>
        );
      },
    },
  ];
  const row = [];

  adminUser &&
    adminUser.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        joinedAt: item.createdAt.slice(0, 10),
      });
    });

  return (
    <div className=" w-full flex justify-center ">
      <div className="w-[95%]">
        <h3 className=" font-Poppins text-[22px] pb-1">All Users</h3>
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
              <h4 className=" p-1 ">Are you sure to delete this user</h4>
              <div className=" flex  items-center 800px:justify-end justify-start m-4 ">
                <div
                  className={`${styles.button} !rounded-[4px] mr-2 !bg-gray-400 text-white w-[100px] !h-[45px]`}
                  onClick={() => setOpen(false)}
                >
                  Cencel
                </div>
                <div
                  className={`${styles.button} !rounded-[4px] !bg-red-500 mr-2 text-white w-[100px] !h-[45px]`}
                  onClick={() => handleDelete(userId)}
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

export default AdminAllUsers;
