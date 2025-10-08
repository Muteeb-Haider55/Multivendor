import axios from "axios";
import { server } from "../../../server";

// Load Seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await axios.get(`${server}/shop/getseller`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response.data.message,
    });
  }
};

// get all sellers for admin
export const getAllSellerforAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllSellerAdminRequest",
    });
    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
    });
    dispatch({
      type: "getAllSellerSuccess",
      payload: data.sellers,
    });
  } catch (error) {
    dispatch({
      type: "getAllSellerFail",
      payload: error.response.data.message,
    });
  }
};
