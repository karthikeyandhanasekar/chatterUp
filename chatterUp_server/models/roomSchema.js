const { mongoose } = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    roomType: {
      type: String,
      required: true,
      default: "User",
      enum: ["User", "Group"],
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);

const Room = mongoose.model("Rooms", roomSchema);

module.exports = Room;
