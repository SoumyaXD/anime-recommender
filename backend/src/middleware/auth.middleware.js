const { verifyAccessToken } = require("../services/token.service");

function getBearerToken(headerValue) {
  if (!headerValue || typeof headerValue !== "string") {
    return null;
  }

  const [scheme, token] = headerValue.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: "Authorization token is required." });
    }

    const payload = verifyAccessToken(token);
    req.auth = payload;

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

function requireScopes(requiredScopes = []) {
  return (req, res, next) => {
    const tokenScopes = Array.isArray(req.auth?.scopes) ? req.auth.scopes : [];
    const hasAllScopes = requiredScopes.every((scope) => tokenScopes.includes(scope));

    if (!hasAllScopes) {
      return res.status(403).json({ message: "Insufficient token scopes." });
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requireScopes,
};
