const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    token: {
      type: String,
      required: true,
      max: 5000,
    },
    refreshtoken: {
        type: String,
        required: true,
        max: 5000,
      },
    isValid: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);