const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
     subscriptions: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subscriptions",
          required: true,
        },
        enrollmentDate: {
          type: Date,
          default: Date.now,
        },
        expirationDate: {
          type: Date,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
        // razorpay_order_id: { // Add this field
        //   type: String,
        // },
        // razorpay_payment_id: { // Add this field
        //   type: String,
        // },
        transaction_id: { // Add this field
          type: String,
        },
        payable: { // Add this field
          type: Number,
        },
        expiryMail:{
          type:Number,
          default:0
        }
      },
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
