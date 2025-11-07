const { clerkClient } = require('@clerk/clerk-sdk-node');
const Users = require('../models/Users');

async function clerkAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token' });
  }
  const token = header.replace('Bearer ', '');

  try {
    // Use verifyToken to verify the session token
    const decoded = await clerkClient.verifyToken(token);
    
    // Get user information from Clerk
    const clerkUser = await clerkClient.users.getUser(decoded.sub);
    
    // Sync user to database if not exists
    let dbUser = await Users.findOne({ clerkId: decoded.sub });
    
    if (!dbUser) {
      // Create new user in database
      dbUser = new Users({
        clerkId: decoded.sub,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        email: clerkUser.emailAddresses?.[0]?.emailAddress || `user_${decoded.sub}@hotello.com`,
        phone: clerkUser.phoneNumbers?.[0]?.phoneNumber || '',
        role: clerkUser.publicMetadata?.role || 'user',
        isVerified: clerkUser.emailAddresses?.[0]?.verification?.status === 'verified' || false
      });
      await dbUser.save();
      console.log('✅ New user synced to database:', dbUser.email);
    }
    
    req.auth = {
      userId: decoded.sub,
      sessionId: decoded.sid,
      role: clerkUser.publicMetadata?.role || 'user',
      dbUser: dbUser
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