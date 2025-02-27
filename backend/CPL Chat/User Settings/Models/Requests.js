const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      required: true,
      max: 50000,
    },
    userIdTwo: {
      type: String,
      require: true,
    },
    usernameTwo: {
      type: String,
      required: true,
      max: 50000,
    },
    isIncoming: {
      type: Boolean,
      default: false,
    },

    isAccepted: {
      type: Boolean,
      default: false,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

  

  },
  { timestamps: true }
);

module.exports = mongoose.model("Requests", RequestSchema);