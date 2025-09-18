const { ClerkExpressRequireAuth, ClerkExpressWithAuth, clerkClient } = require('@clerk/clerk-sdk-node');
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Role-based middleware (checks privateMetadata for security)
function requireRole(role) {
  return (req, res, next) => {
    const { user } = req;
    if (!user || !user.privateMetadata || user.privateMetadata.role !== role) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
}

// Save user to MongoDB on first login/registration
router.get('/profile', (req, res, next) => {
  console.log('=== /auth/profile route called ===');
  console.log('Headers:', req.headers);
  next();
}, ClerkExpressRequireAuth(), async (req, res) => {
  try {
    console.log('=== Inside ClerkExpressRequireAuth middleware ===');
    console.log('Full req object keys:', Object.keys(req));
    console.log('req.auth:', req.auth);
    console.log('req.user:', req.user);
    
    const { userId } = req.auth;
    console.log('userId from req.auth:', userId);
    
    if (!userId) {
      return res.status(400).json({ message: 'No user ID found in request' });
    }

    // Fetch user data from Clerk
    console.log('Fetching user data from Clerk...');
    const clerkUser = await clerkClient.users.getUser(userId);
    console.log('Clerk user data:', clerkUser);

    // Try to find user in DB
    let dbUser = await User.findOne({ clerkId: userId });
    if (!dbUser) {
      console.log('User not found in DB, creating new user...');
      
      // Extract user data from Clerk response
      const email = clerkUser.emailAddresses?.[0]?.emailAddress || 'unknown@example.com';
      const firstName = clerkUser.firstName || clerkUser.username || 'Unknown';
      const lastName = clerkUser.lastName || 'User';
      
      dbUser = await User.create({
        clerkId: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: clerkUser.privateMetadata?.role || 'user',
      });
      console.log('User created in MongoDB:', dbUser);
    } else {
      console.log('User found in DB:', dbUser);
    }
    res.json({
      id: dbUser._id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      role: dbUser.role,
    });
  } catch (err) {
    console.error('Error in /auth/profile:', err);
    res.status(500).json({ message: 'Error fetching user profile', error: err.message });
  }
});

// Example admin-only route
router.get('/admin', ClerkExpressWithAuth(), requireRole('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

// Example hotel owner-only route
router.get('/hotel-owner', ClerkExpressWithAuth(), requireRole('hotel owner'), (req, res) => {
  res.json({ message: 'Welcome, hotel owner!' });
});

module.exports = router;
