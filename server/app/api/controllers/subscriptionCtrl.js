const subscriptionModel = require("../models/subscription")
const crypto = require("crypto");
const { razorpayInstance } = require("../config/ragorpay");
const authModel = require("../models/User")


const createSubscriptionCtrl = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    console.log("User ID:", req.user.id);

    const options = {
      amount: Math.round(totalAmount * 100), // ✅ Razorpay expects amount in paise (integer)
      currency: "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 100000)}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ orderId: order.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in creating order",
    });
  }
};



const verifyPaymentCtrl = async (req, res) => {
  try {
        console.log("REQ BODY:", req.body);

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderDetails } = req.body;
    const { type, totalAmount, subscriptionId } = orderDetails;
    const userId = req.user.id;
console.log("first")
    if (!type || !totalAmount || !subscriptionId) {
      return res.status(400).json({ message: "Missing order details." });
    }

    const secret = process.env.RAZORPAY_SECRET;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed." });
    }

    const subscription = await subscriptionModel.findById(subscriptionId);
    if (!subscription) return res.status(404).json({ message: "Subscription not found." });

    const enrollmentDate = new Date();
    const expirationDate = new Date(subscription.endDate);

    // Add to User
    await authModel.findByIdAndUpdate(userId, {
      $push: {
        subscriptions: {
          service: subscription._id,
          enrollmentDate,
          expirationDate,
          isActive: true,
          transaction_id: razorpay_payment_id,
          payable: totalAmount,
          expiryMail: 0,
        },
      },
    });

    // Add to Subscriptions
    await subscriptionModel.findByIdAndUpdate(subscriptionId, {
      $push: {
        usersEnroled: {
          user: userId,
          enrollmentDate,
          expirationDate,
          transaction_id: razorpay_payment_id,
          payable: totalAmount,
          expiryMail: 0,
        },
      },
    });

    return res.status(200).json({ message: "Payment verified and subscription added." });

  } catch (error) {
    console.error("Error in verifyPaymentCtrl:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};



const getAllSubctrl = async (req, res) => {
  try {
    const subscriptions = await subscriptionModel
      .find({})
      .populate("usersEnroled.user"); // Populate enrolled users

    return res.status(200).json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    console.error("Error in getAllSubctrl:", error);
    return res.status(500).json({
      success: false,
      message: "Error in getting subscriptions",
    });
  }
};




const createSubscription = async (req, res) => {
  try {
    const {
      type,
      description,
      rate,
      totalAmount,
     
      paymentDetails,
    } = req.body;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month validity

    const subscription = await subscriptionModel.create({
      type,
      description,
      rate,
   totalAmount,
      paymentDetails,
      startDate,
      endDate,
      isActive: true,
    });

    res.status(201).json({ success: true, subscription });
  } catch (error) {
    console.error("Create Subscription Error:", error);
    res.status(500).json({ success: false, message: "Failed to create subscription" });
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
   const subscriptions = await subscriptionModel
      .find({})
      .populate("usersEnroled.user"); // Populate enrolled users

    res.status(200).json({ success: true, subscriptions });
  } catch (error) {
    console.error("Get All Subscriptions Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch subscriptions" });
  }
};



const getUserSubscriptionsCtrl = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await authModel.findById(userId)
      .populate({
        path: "subscriptions.service",
        model: "Subscriptions", // make sure your subscription model name is correct
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      subscriptions: user.subscriptions,
    });
  } catch (error) {
    console.error("Error in getUserSubscriptionsCtrl:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user subscriptions" });
  }
};


const addMeetingToUser = async (userId, roomId) => {
  try {
    // 1. Add to `meetings`
    await authModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          meetings: {
            roomId,
            joinedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    // 2. Update the corresponding upcoming meeting
    await authModel.updateOne(
      { _id: userId, "upCommingMeetings.roomId": roomId },
      {
        $set: {
          "upCommingMeetings.$.isJoined": true,
          "upCommingMeetings.$.joinedAt": new Date(),
        },
      }
    );
  } catch (err) {
    console.error("Error adding meeting to user:", err);
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await authModel.find()
      .populate({
        path: 'subscriptions.service',
        model: 'Subscriptions', // Must match your Subscriptions model name
      })
      .sort({ createdAt: -1 }); // Optional: recent users first

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
    });
  }
};



module.exports = { 
    createSubscriptionCtrl, 
    verifyPaymentCtrl, 
    getAllSubctrl,
    createSubscription,
    getAllSubscriptions,
    getUserSubscriptionsCtrl,
    addMeetingToUser,
    getAllUsers
 }
