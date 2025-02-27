const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    groupName: {
      type: String,
      max: 500,
    },
    groupEmoji: {
      type: String,
      max: 500,
      default: "",
    },
    members: {
      type: Array,
      default: [],
    },
    admins: {
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

module.exports = mongoose.model("Group", GroupSchema);