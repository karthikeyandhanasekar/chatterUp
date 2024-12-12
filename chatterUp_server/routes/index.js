const express = require("express");
const router = express.Router();
const Room = require("../models/userSchema.js");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      error: error.error.message,
    });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const isDataExists = await Room.findOne({ ...req.body });
    if (isDataExists?._id) {
      throw new Error(`${isDataExists.name} already exists`);
    }
    const user = await new Room(req.body).save();

    if (user) {
      res.status(201).json({
        success: false,
        user,
      });
    }
  } catch (error) {
    // Emit an error event to the client
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
