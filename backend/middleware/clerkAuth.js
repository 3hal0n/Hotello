const { Clerk } = require('@clerk/clerk-sdk-node'); 
const clerk = new Clerk({ apiKey: process.env.CLERK_API_KEY });

module.exports = async function clerkAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token' });
  }
  const token = header.replace('Bearer ', '');

  try {
    // TODO: replace the following with the exact verify API from @clerk/clerk-sdk-node
    // e.g. const session = await clerk.verifySessionToken(token) or the recommended method
    const session = await clerk.verifyToken(token); // placeholder — adapt to SDK
    req.auth = { userId: session.userId, sessionId: session.id };
    next();
  } catch (err) {
    console.error('Auth verify failed', err);
    res.status(401).json({ error: 'Invalid/expired token' });
  }
};