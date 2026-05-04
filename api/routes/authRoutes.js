const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify/:token", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);
router.get("/me", authMiddleware, authController.me);
router.put("/profile", authMiddleware, authController.updateProfile);
router.put("/password", authMiddleware, authController.changePassword);
router.delete("/profile", authMiddleware, authController.deleteAccount);

module.exports = router;
