const userRepository = require("../repositories/user.repository");
const { hashPassword, verifyPassword } = require("./password.service");
const { createAccessToken } = require("./token.service");

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    scopes: user.scopes,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register({ name, email, password }) {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    return { error: "User already exists.", status: 409 };
  }

  const passwordHash = await hashPassword(password);
  const user = await userRepository.createUser({
    name,
    email,
    passwordHash,
    scopes: ["user"],
  });

  const token = createAccessToken(user);

  return {
    user: toPublicUser(user),
    token,
  };
}

async function login({ email, password }) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    return { error: "Invalid email or password.", status: 401 };
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);
  if (!isValidPassword) {
    return { error: "Invalid email or password.", status: 401 };
  }

  const token = createAccessToken(user);

  return {
    user: toPublicUser(user),
    token,
  };
}

async function getUserById(id) {
  const user = await userRepository.findById(id);
  return user ? toPublicUser(user) : null;
}

module.exports = {
  register,
  login,
  getUserById,
};
