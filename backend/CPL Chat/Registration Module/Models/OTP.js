const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    digit: {
      type: String,
      required: true,
      max: 5000,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    canPasswordBeChanged:{
        type: Boolean,
        default: false,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", OTPSchema);