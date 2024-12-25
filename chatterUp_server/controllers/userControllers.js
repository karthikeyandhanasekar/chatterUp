const { default: mongoose } = require("mongoose");
const User = require("../models/userSchema");
const Room = require("../models/roomSchema");
const Message = require("../models/messageSchema");

const { CustomErrorHandler } = require("../middleware/errorsMiddleware");
const { generateToken } = require("../services/tokenService");
const { log } = require("winston");

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
    if (!room || typeof room !== "string" || room.trim() === "") {
      return res.status(400).json({ error: "Invalid room name provided" });
    }
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
    console.log(error);

    next(new CustomErrorHandler(500, error.message));
  }
};

exports.getRoomList = async (req, res, next) => {
  try {
    let rooms = await Room.find({
      participants: { $in: req.user._id },
    })
      .select({ _id: 1, room: 1, participants: 1, roomType: 1, img: 1 })
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
        messageType: 1,
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

exports.leaveRoom = async (req, res, next) => {
  try {
    let { id: roomId } = req.params;

    let messages = await Room.updateOne(
      { _id: roomId },
      { $pull: { participants: { $in: req.user._id } } } // Remove multiple participants
    );
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

    // const isUserExists = await User.findOne(
    //   { name } // Find user by name
    // );
    // if (isUserExists?._id) {
    //   next(new CustomErrorHandler(400, "Username already exists"));
    // }
    const user = await User.findOneAndUpdate(
      { name }, // Find user by name
      { $set: { name } }, // Update name (if necessary)
      { upsert: true, new: true } // Perform upsert if the user doesn't exist
    );
    const userId = user._doc._id;
    const userName = user._doc.name;
    const token = generateToken({ ...user._doc });

    const rooms = await Room.find({
      roomType: "Group",
      participants: { $ne: userId }, // MongoDB operator to check "not equal" in array
    });

    if (rooms.length === 0) {
      return res.status(201).json({
        success: true,
        isNewlyJoined: false,
        token,
      });
    }

    // Update each room to add the user to the participants array
    const updatePromises = rooms.map((room) =>
      Room.updateOne(
        { _id: room._id },
        { $push: { participants: userId } } // Add user to participants
      )
    );

    // Execute all updates
    await Promise.all(updatePromises);

    if (user) {
      res.status(201).json({
        success: true,
        isNewlyJoined: true,
        token,
        userName,
        userId,
        roomIds: rooms.map((room) => room._id),
      });
    }
  } catch (error) {
    // Emit an error event to the client
    console.log(error);
    next(new CustomErrorHandler(500, "Internal Server Error"));
  }
};

exports.createMessage = async (req, res, next) => {
  try {
    const { id: roomId } = req.params;
    let { _id: userId } = req.user;
    const { message, id, messageType } = req.body;

    userId = id ?? userId;

    const savedMessage = await new Message({ roomId, userId, message }).save();

    const populatedMessage = await Message.findById(savedMessage._id).select({
      _id: 1,
      createdAt: 1,
      message: 1,
      userId: 1,
    });
    return res.status(201).json({
      success: true,
      populatedMessage,
    });
  } catch (error) {
    next(new CustomErrorHandler(500, error.message));
  }
};

exports.socketCreateMessage = async (socket, data) => {
  try {
    let { message, userId, roomId, messageType } = data;
    messageType = messageType ?? "message";

    const savedMessage = await new Message({
      roomId,
      userId,
      message,
      messageType,
    }).save();

    const populatedMessage = await Message.findById(savedMessage._id)
      .select({
        _id: 1,
        createdAt: 1,
        message: 1,
        userId: 1,
        messageType,
      })
      .populate("userId", { _id: 1, name: 1 });
    const response = {
      success: true,
      message: populatedMessage,
    };
    socket.to(roomId).emit("newMessageSuccess", response);
    socket.emit("newMessageSuccess", response); // Sends back to the sender
  } catch (error) {
    console.log(error);

    let { roomId } = data;

    socket.to(roomId).emit("newMessageError", {
      success: false,
      message: error.message,
    });
    socket.emit("newMessageError", {
      success: false,
      message: error.message,
    }); // Sends back to the sender
  }
};

exports.socketLeaveRoom = async (socket, data) => {
  try {
    let { roomId, userId } = data;

    const room = await Room.findByIdAndUpdate(
      roomId,
      { $pull: { participants: userId } }, // Pull the participant ID from the array
      { new: true } // Return the updated document
    );
    socket.to(roomId).emit("newRoomDetails", Room);
    socket.emit("newRoomDetails", room); // Sends back to the sender
  } catch (error) {
    console.log(error);
    let { roomId } = data;
    socket.to(roomId).emit("newMessageError", {
      success: false,
      message: error.message,
    });
    socket.emit("newMessageError", {
      success: false,
      message: error.message,
    }); // Sends back to the sender
  }
};
