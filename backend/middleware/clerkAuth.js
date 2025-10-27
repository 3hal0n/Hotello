const { verifySessionToken, users } = require('@clerk/clerk-sdk-node');

async function clerkAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token' });
  }
  const token = header.replace('Bearer ', '');

  try {
    const session = await verifySessionToken(token);
    const user = await users.getUser(session.userId);
    req.auth = {
      userId: session.userId,
      sessionId: session.id,
      role: user.publicMetadata?.role || 'user',
    };
    next();
  } catch (err) {
    console.error('Auth verify failed', err);
    res.status(401).json({ error: 'Invalid/expired token' });
  }
}

function requireRole(role) {
  return function (req, res, next) {
    if (!req.auth || req.auth.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

module.exports = clerkAuth;
module.exports.requireRole = requireRole;