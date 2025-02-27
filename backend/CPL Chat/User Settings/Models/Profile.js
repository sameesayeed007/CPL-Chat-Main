const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    fullName: {
      type: String,
      max: 500,
    },
    profilePhoto: {
      type: String,
      max: 500,
    },
    address: {
      type: String,
      max: 500,
    },
    phoneNumber: {
      type: String,
      max: 500,
    },
    friends: {
      type: Array,
      default: [],
    },
    groups: {
      type: Array,
      default: [],
    },
    createdGroups: {
      type: Array,
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },


  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);