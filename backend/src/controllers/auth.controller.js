const { register, login, getUserById } = require("../services/auth.service");

function validateEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body || {};

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Name is required." });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Valid email is required." });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const result = await register({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ message: "Valid email and password are required." });
    }

    const result = await login({ email: email.trim(), password });

    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const user = await getUserById(req.auth.sub);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
