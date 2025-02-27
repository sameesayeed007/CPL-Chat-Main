const mongoose = require("mongoose");

const NotificationsSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: String,
      require: true,
    },
    toUserId: {
      type: String,
      required: true,
    },
    isMessage: {
      type: Boolean,
      default: false,
    },
    isMessageReceived: {
        type: Boolean,
        default: false,
      },
    isMessageReact: {
        type: Boolean,
        default: false,
    },
    isMessageRoomModification: {
        type: Boolean,
        default: false,
    },
    isRoomEmojiChanged: {
        type: Boolean,
        default: false,
    },
    isNicknameChanged: {
        type: Boolean,
        default: false,
    },
    isGroup: {
        type: Boolean,
        default: false,
    },
    isAddedGroup: {
        type: Boolean,
        default: false,
    },
    isRemovedGroup: {
        type: Boolean,
        default: false,
    },
    isFriendRequest: {
        type: Boolean,
        default: false,
    },
    isFriendRequestReceived: {
        type: Boolean,
        default: false,
    },

    isFriendRequestAccepted: {
      type: Boolean,
      default: false,
    },
    isFriendRequestRejected: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    content: {
        type: String,
        require: true,
    },

    readDateTime: {
        type: Date,
        default: "",
    },

  

  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationsSchema);