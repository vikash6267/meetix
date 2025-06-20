const express = require("express");
const { auth } = require("../middleware/auth");
const { createSubscriptionCtrl, verifyPaymentCtrl, getAllSubctrl, createSubscription, getAllSubscriptions, getUserSubscriptionsCtrl, getAllUsers, editSubscription } = require("../controllers/subscriptionCtrl")
const router = express.Router();

router.post("/create",  createSubscriptionCtrl);
router.post("/payment-success", auth, verifyPaymentCtrl);
router.get("/getAll", auth, getAllSubctrl);

router.post("/maincreate", createSubscription);
router.post("/edit/:id", editSubscription);
router.get("/all", getAllSubscriptions);
router.post("/my-subscriptions", auth, getUserSubscriptionsCtrl);
router.get('/users', getAllUsers);

module.exports = router;
