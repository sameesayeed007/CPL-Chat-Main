const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    link: {
      type: String,
      required: true,
      max: 500,
    },
    isClicked: {
      type: Boolean,
      default: false,
    },
    forRegistration: {
        type: Boolean,
        default: false,
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Link", LinkSchema);