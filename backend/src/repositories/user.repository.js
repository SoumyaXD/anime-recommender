const crypto = require("crypto");

const usersById = new Map();
const usersByEmail = new Map();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function findByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  return usersByEmail.get(normalizedEmail) || null;
}

async function findById(id) {
  return usersById.get(id) || null;
}

async function createUser({ name, email, passwordHash, scopes = ["user"] }) {
  const normalizedEmail = normalizeEmail(email);
  const now = new Date().toISOString();

  const user = {
    id: crypto.randomUUID(),
    name: String(name || "").trim(),
    email: normalizedEmail,
    passwordHash,
    scopes: Array.isArray(scopes) && scopes.length > 0 ? scopes : ["user"],
    createdAt: now,
    updatedAt: now,
  };

  usersById.set(user.id, user);
  usersByEmail.set(user.email, user);

  return user;
}

module.exports = {
  findByEmail,
  findById,
  createUser,
};
