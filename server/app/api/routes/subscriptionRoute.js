const express = require("express");
const { auth } = require("../middleware/auth");
const { createSubscriptionCtrl, verifyPaymentCtrl, getAllSubctrl, createSubscription, getAllSubscriptions, getUserSubscriptionsCtrl, getAllUsers } = require("../controllers/subscriptionCtrl")
const router = express.Router();

router.post("/create", auth, createSubscriptionCtrl);
router.post("/payment-success", auth, verifyPaymentCtrl);
router.get("/getAll", auth, getAllSubctrl);

router.post("/maincreate", createSubscription);
router.get("/all", getAllSubscriptions);
router.post("/my-subscriptions", auth, getUserSubscriptionsCtrl);
router.get('/users', getAllUsers);

module.exports = router;
