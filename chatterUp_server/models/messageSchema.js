const { mongoose } = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      required: true,
      trim: true,
      default: "message",
      enum: ["message", "banner"],
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms",
      required: true, // Ensure that the userId is always present
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true, // Ensure that the userId is always present
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Messages", messageSchema);

module.exports = Message;
