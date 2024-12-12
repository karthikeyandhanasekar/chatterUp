const { mongoose } = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    roomId: {
      type: mongoose.Schema.Type.ObjectId,
      ref: "Rooms",
      required: true, // Ensure that the userId is always present
    },
    senderId: {
      type: mongoose.Schema.Type.ObjectId,
      ref: "Rooms",
      required: true, // Ensure that the userId is always present
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Messages", messageSchema);

module.exports = Message;
