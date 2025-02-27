const mongoose = require("mongoose");

const SocketInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    socketId: {
      type: String,
      required: true,
      max: 500,
    },
    isValid: {
      type: Boolean,
      default: false,
    },


  },
  { timestamps: true }
);

module.exports = mongoose.model("SocketInfo", SocketInfoSchema);