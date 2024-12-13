const { default: mongoose } = require("mongoose");
const User = require("../models/userSchema");
const Room = require("../models/roomSchema");
const Message = require("../models/messageSchema");

const { CustomErrorHandler } = require("../middleware/errorsMiddleware");
const { generateToken } = require("../services/tokenService");

exports.getUsers = async (req, res, next) => {
  try {
    const rooms = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    next(new CustomErrorHandler(500, error.message));
  }
};
/* GET home page. */

exports.getContacts = async (req, res, next) => {
  try {
    console.log(req.user);

    const rooms = await User.find({ _id: { $ne: req.user._id } }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    next(new CustomErrorHandler(500, error.message));
  }
};

exports.createRoomController = async (req, res, next) => {
  try {
    let { id: _id, room, participantIds } = req.body;
    participantIds = [req.user._id, ...participantIds];
    // Check if room is an ObjectId or a string (name)
    const query = mongoose.Types.ObjectId.isValid(_id)
      ? { _id, room } // If room is a valid ObjectId, search by _id
      : { room }; // Otherwise, search by room name

    const { _doc: roomDoc } = await Room.findOneAndUpdate(
      query, // Find room by room name
      {
        $addToSet: { participants: { $each: participantIds } }, // Add new participants (avoiding duplicates)
      },
      { upsert: true, new: true } // If room doesn't exist, create new one; return updated/new room
    );

    return res.status(201).json({
      success: true,
      roomDoc,
    });
  } catch (error) {
    next(new CustomErrorHandler(500, error.message));
  }
};

exports.getRoomList = async (req, res, next) => {
  try {
    let rooms = await Room.find({
      participants: { $in: req.user._id },
    })
      .select({ _id: 1, room: 1, participants: 1, roomType: 1 })
      .populate("participants", { _id: 1, name: 1 });
    rooms = rooms.map((room) => {
      const filteredParticipants = room.participants.filter(
        (participant) => participant._id.toString() !== req.user._id.toString()
      );
      return {
        ...room.toObject(), // Convert Mongoose document to plain object
        participants: filteredParticipants, // Replace participants with the filtered array
      };
    });
    return res.status(201).json({
      success: true,
      rooms,
    });
  } catch (error) {
    next(new CustomErrorHandler(500, error.message));
  }
};

exports.getRoomDetails = async (req, res, next) => {
  try {
    let { id: _id } = req.params;

    const { _doc: roomDoc } = await Room.findOne({ _id }).populate(
      "participants",
      { _id: 1, name: 1 }
    );

    return res.status(201).json({
      success: true,
      roomDoc,
    });
  } catch (error) {
    next(new CustomErrorHandler(500, error.message));
  }
};

exports.getRoomMessages = async (req, res, next) => {
  try {
    let { id: roomId } = req.params;

    let messages = await Message.find({ roomId })
      .select({
        _id: 1,
        createdAt: 1,
        message: 1,
        userId: 1,
      })
      .populate("userId");

    messages = messages.map((message) => {
      return {
        ...message.toObject(), // Convert Mongoose document to plain object
        isSender: message.userId._id.toString() !== req.user._id.toString(), // Add isSender field
      };
    });
    return res.status(201).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(new CustomErrorHandler(500, error.message));
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findOneAndUpdate(
      { name }, // Find user by name
      { $set: { name } }, // Update name (if necessary)
      { upsert: true, new: true } // Perform upsert if the user doesn't exist
    );
    const token = generateToken({ ...user._doc });

    if (user) {
      res.status(201).json({
        success: true,
        token,
      });
    }
  } catch (error) {
    // Emit an error event to the client
    next(new CustomErrorHandler(500, "Internal Server Error"));
  }
};

exports.createMessage = async (req, res, next) => {
  try {
    const { id: roomId } = req.params;
    const { _id: userId } = req.user;
    const { message } = req.body;

    await new Message({ roomId, userId, message }).save();
    return res.status(201).json({
      success: true,
      // savedMessage,
    });
  } catch (error) {
    next(new CustomErrorHandler(500, error.message));
  }
};
