const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      required: true,
      max: 50000,
    },
    messageContent: {
      type: String,
      max: 50000,
    },
    roomId: {
        type: String,
        required: true,
      },
    messageId: {
        type: String,
        default: ""
      },
    isGroup: {
      type: Boolean,
      default: false,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isUnsent: {
      type: Boolean,
      default: false,
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    dateTime: {
      type: Date,
      default: "",
  },
    seenDateTime: {
      type: Date,
      default: "",
  },
  

  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);