const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    emoji: {
      type: String,
      required: true,
      max: 50000,
    },
    messageId: {
        type: String,
        required: true,
      },
    isRemoved: {
      type: Boolean,
      default: false,
    },
    dateTime: {
      type: Date,
      default: "",
  },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Reaction", ReactionSchema);