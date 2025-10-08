import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrderOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/seller";
import { AiOutlineDelete } from "react-icons/ai";

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: null,
    bankAccountNumber: null,
    bankHolderName: "",
    bankAddress: "",
  });
  const withdrawMethods = {
    bankName: bankInfo.bankName,
    bankCountry: bankInfo.bankCountry,
    bankSwiftCode: bankInfo.bankSwiftCode,
    bankAccountNumber: bankInfo.bankAccountNumber,
    bankHolderName: bankInfo.bankHolderName,
  };
  const dispatch = useDispatch();

  const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrderOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${server}/shop/update-payment-methods`,
        { withdrawMethods },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw method added successfully");
        setBankInfo({
          bankName: "",
          bankCountry: "",
          bankSwiftCode: null,
          bankAccountNumber: null,
          bankHolderName: "",
          bankAddress: "",
        });
        setPaymentMethod(false);
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setBankInfo({
          bankName: "",
          bankCountry: "",
          bankSwiftCode: null,
          bankAccountNumber: null,
          bankHolderName: "",
          bankAddress: "",
        });
      });
  };

  const deleteHandler = async () => {
    await axios
      .delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Withdraw method deleted successfully");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  const error = () => {
    toast.error("Ypu have not enough balance!");
  };
  const withDrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > availableBalance) {
      toast.error("You are not able to withdraw ");
    } else {
      const amount = withdrawAmount;
      await axios
        .post(
          `${server}/withdraw/create-withdraw-request`,
          { amount },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success("Withdraw money request successfull");
        });
    }
  };
  const availableBalance = seller?.availableBalance.toFixed(2);

  return (
    <div className=" w-full h-[90vh] p-8">
      <div className=" w-full bg-white h-full rounded flex items-center justify-center flex-col">
        <h5 className="text-[20px] pb-4">
          Available Balance ${availableBalance}
        </h5>
        <div
          className={`${styles.button} text-white !rounded-[4px] !h-[42px]`}
          onClick={() => (availableBalance < 50 ? error : setOpen(true))}
        >
          Withdraw
        </div>
      </div>
      {open && (
        <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-[#0000004e]">
          <div
            className={` w-[95%] 800px:w-[50%] bg-white shadow rounded min-h-[40vh] ${
              paymentMethod ? "h-[80vh] overflow-y-scroll" : "h-[unset]"
            } p-3`}
          >
            <div className=" w-full flex justify-end">
              <RxCross1
                size={25}
                onClick={() => setOpen(false) || setPaymentMethod(false)}
                className="cursor-pointer"
              />
            </div>
            {paymentMethod ? (
              <div className="">
                <h3 className=" text-[22px] font-Poppins font-600]">
                  Add New Payment Method
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className=" p-3">
                    <label>
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`${styles.input}`}
                      placeholder=" Enter Bank name!"
                      required
                      value={bankInfo.bankName}
                      onChange={(e) =>
                        setBankInfo({ ...bankInfo, bankName: e.target.value })
                      }
                    />
                  </div>
                  <div className=" p-3">
                    <label>
                      Bank Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`${styles.input}`}
                      placeholder=" Enter bank country!"
                      required
                      value={bankInfo.bankCountry}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankCountry: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className=" p-3">
                    <label>
                      Bank Swift Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`${styles.input}`}
                      placeholder=" Enter Bank Swift Code!"
                      required
                      value={bankInfo.bankSwiftCode}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankSwiftCode: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className=" p-3">
                    <label>
                      Bank Account Number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      className={`${styles.input}`}
                      placeholder=" Enter your bank account number!"
                      required
                      value={bankInfo.bankAccountNumber}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAccountNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className=" p-3">
                    <label>
                      Bank Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`${styles.input}`}
                      placeholder=" Enter bank holder name!"
                      required
                      value={bankInfo.bankHolderName}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankHolderName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className=" p-3">
                    <label>
                      Bank Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`${styles.input}`}
                      placeholder=" Enter bank address!"
                      required
                      value={bankInfo.bankAddress}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className={`${styles.button} !rounded-[4px] mb-3 text-white`}
                  >
                    Add
                  </button>
                </form>
              </div>
            ) : (
              <>
                <h3 className=" text-[22px] font-Poppins">
                  Available Withdraw Method:
                </h3>
                {seller && seller?.withdrawMethods ? (
                  <div className=" mt-3">
                    <div className=" flex w-full justify-center">
                      <div className="800px: w-[50%]">
                        <h5>
                          Account No:{"  "}
                          {"*".repeat(
                            seller.withdrawMethods.bankAccountNumber.length - 3
                          ) +
                            seller.withdrawMethods.bankAccountNumber.slice(-3)}
                        </h5>
                        <h5>
                          Bank Name:{"  "}
                          {seller?.withdrawMethods.bankName}
                        </h5>
                      </div>
                      <div className=" 800px:w-[50%]  flex justify-start">
                        <AiOutlineDelete
                          size={25}
                          className="cursor-pointer"
                          onClick={deleteHandler}
                        />
                      </div>
                    </div>
                    <br />
                    <h4>
                      Total Available Balance:{" "}
                      <strong> {availableBalance}</strong> $
                    </h4>
                    <br />
                    <div className=" 800px:flex  w-full items-center">
                      <input
                        type="number"
                        className={`${styles.input} 800px:mr-2 h-[40px]`}
                        placeholder="Enter Withdraw Amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                      <button
                        className={`${styles.button} text-white !rounded-[4px] !h-[40px]`}
                        onClick={withDrawHandler}
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <p className=" text-[18px]  pt-2">
                      No withdraw method available
                    </p>
                    <div className=" w-full flex items-center  ">
                      <div
                        className={`${styles.button} mt-4 !rounded-[4px]`}
                        onClick={() => setPaymentMethod(true)}
                      >
                        Add New
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
