const catchAsyncErrors = require("../middlware/catchAsyncErrors.js");
const Conversation = require("../models/conversation.js");
const express = require("express");
const ErrorHandler = require("../utils/ErrorHandler.js");
const { isAuthenticated, isSeller, isAdmin } = require("../middlware/auth.js");
const Withdraw = require("../models/withdraw.js");
const sendMail = require("../utils/sendMail.js");
const Shop = require("../models/shop.js");
const router = express.Router();

//create new withdraw request only for seller
router.post(
  "/create-withdraw-request",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { amount } = req.body;
      const data = {
        seller: req.seller,
        amount,
      };
      try {
        await sendMail({
          email: req.seller.email,
          subject: "Withdraw Request",
          message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is in processing. It will take 3 to 7 days for processing`,
        });
        res.status(201).json({
          success: true,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
      const withdraw = Withdraw.create(data);
      const shop = await Shop.findById(req.seller._id);
      shop.availableBalance = shop.availableBalance - amount;
      await shop.save();
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  })
);

// get all withdraw for admin
router.get(
  "/get-all-withdraw-requests",
  isAuthenticated,
  isAdmin("admin"),

  catchAsyncErrors(async (req, res, next) => {
    try {
      const withdraws = await Withdraw.find().sort({ createdAt: -1 });
      res.status(201).json({
        success: true,
        withdraws,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  })
);
// update withdraw request by admin
router.put(
  "/update-withdraw-request/:id",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { sellerId } = req.body;
      const withdraw = await Withdraw.findByIdAndUpdate(
        req.params.id,
        {
          status: "Succeed",
          updatedAt: Date.now(),
        },
        { new: true }
      );
      const seller = await Shop.findById(sellerId);
      const transection = {
        _id: withdraw._id,
        amount: withdraw.amount,
        updatedAt: withdraw.updatedAt,
        status: withdraw.status,
      };
      seller.transections = [...seller.transections, transection];
      await seller.save();
      // send mail to seller

      try {
        await sendMail({
          email: seller.email,
          subject: "Payment confirmation",
          message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ is on the way.Delivery time depends on your bank rules ite usually take 5 to 7 days`,
        });
        res.status(201).json({
          success: true,
          withdraw,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
      res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  })
);
module.exports = router;
