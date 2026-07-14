const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { authRateLimiter } = require("../middleware/rate-limit.middleware");

const router = express.Router();

router.post("/register", authRateLimiter, registerUser);
router.post("/login", authRateLimiter, loginUser);
router.get("/me", requireAuth, getCurrentUser);

module.exports = router;
