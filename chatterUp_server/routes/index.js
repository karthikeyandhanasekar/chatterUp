const express = require("express");
const router = express.Router();
const User = require("../models/userSchema.js");
const { generateToken } = require("../services/tokenService.js");
const userRouter = require("./userRouters.js");
const authorizationMiddleware = require("../middleware/authorizationMiddleware.js");
/* GET home page. */

router.get("/", authorizationMiddleware, (req, res) => {
  if (req.user._id) {
    return res.status(200).json({
      success: true,
    });
  }
});
router.use("/users", userRouter);

module.exports = router;
