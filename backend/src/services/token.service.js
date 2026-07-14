const jwt = require("jsonwebtoken");
const {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_ISSUER,
  JWT_AUDIENCE,
} = require("../config/auth.config");

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      scopes: user.scopes,
      name: user.name,
    },
    JWT_ACCESS_SECRET,
    {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, JWT_ACCESS_SECRET, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}

module.exports = {
  createAccessToken,
  verifyAccessToken,
};
