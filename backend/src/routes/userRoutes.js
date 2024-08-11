const userRoutes = require("express").Router();
const userController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/authMiddleware");
const cors = require("cors");

userRoutes.use(cors())
userRoutes.get("/users",userController.getAllUsers);

userRoutes.get("/users/:id", userController.getUserById);
userRoutes.put("/users/:id", userController.updateUserById);
userRoutes.post("/users",userController.createUser);
userRoutes.post("/register", userController.userRegistration);

userRoutes.delete("/users/:id", userController.deleteUserById);
userRoutes.get("/search/users",authMiddleware, userController.searchUsers);

module.exports = userRoutes;