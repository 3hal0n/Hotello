// backend/middleware/clerkAuth.js
const { Clerk } = require('@clerk/clerk-sdk-node'); // or use the SDK's recommended import
const clerk = new Clerk({ apiKey: process.env.CLERK_API_KEY });

module.exports = async function clerkAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token' });
  }
  const token = header.replace('Bearer ', '');

  try {
    // Replace this with the SDK's method for verifying session tokens.
    // Many SDKs expose a method to verify session tokens and return user/session info.
    const session = await clerk.verifyToken(token); // pseudocode — adapt to SDK
    // e.g. session = { userId: 'abc', sessionId: '...' }
    req.auth = { userId: session.userId, sessionId: session.sessionId };
    next();
  } catch (err) {
    console.error('Auth error', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};