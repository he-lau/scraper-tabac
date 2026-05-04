const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify/:token", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);
router.get("/me", authMiddleware, authController.me);

module.exports = router;
