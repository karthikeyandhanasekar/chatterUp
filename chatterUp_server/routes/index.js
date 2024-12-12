const express = require("express");
const router = express.Router();
const User = require("../models/userSchema.js");
const { generateToken } = require("../services/tokenService.js");
const userRouter = require("./userRouters.js");
/* GET home page. */
router.use("/users", userRouter);

module.exports = router;
