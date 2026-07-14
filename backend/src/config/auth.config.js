const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-me";
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "1h";
const JWT_ISSUER = process.env.JWT_ISSUER || "anime-recommender";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "anime-recommender-client";

module.exports = {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_ISSUER,
  JWT_AUDIENCE,
};
