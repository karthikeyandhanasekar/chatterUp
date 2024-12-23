const express = require("express");
const router = express.Router();
const authorizationMiddleware = require("../middleware/authorizationMiddleware.js");
const UserController = require("../controllers/userControllers.js");

router.route("/").post(UserController.createUser);
router.route("/").get(authorizationMiddleware, UserController.getUsers);

router
  .route("/contacts")
  .get(authorizationMiddleware, UserController.getContacts);
router
  .route("/createRoom")
  .post(authorizationMiddleware, UserController.createRoomController);
router
  .route("/getRoom")
  .get(authorizationMiddleware, UserController.getRoomList);

router
  .route("/getRoomDetails/:id")
  .get(authorizationMiddleware, UserController.getRoomDetails);

router
  .route("/roomMessage/:id")
  .get(authorizationMiddleware, UserController.getRoomMessages);

router
  .route("/createMessage/:id")
  .post(authorizationMiddleware, UserController.createMessage);

router
  .route("/createMessage/:id")
  .put(authorizationMiddleware, UserController.leaveRoom);

module.exports = router;
