const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,

    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    friends: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isConnected: {
        type: Boolean,
        default: false,
      },
    isVerified: {
        type: Boolean,
        default: false,
      },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);