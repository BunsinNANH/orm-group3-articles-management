const express = require("express");
const authController = require("../controllers/auth/AuthController");
const authMiddleware = require("../middlewares/authMiddleware");
const authRoutes = express.Router();
const cors = require("cors");
// const app = express();

authRoutes.use(cors())

authRoutes.post("/login",authController.login);
// authRoutes.get("/profile", authController.profile);

module.exports = authRoutes;