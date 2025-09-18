const { ClerkExpressRequireAuth, ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
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
router.get('/profile', ClerkExpressRequireAuth(), async (req, res) => {
  const { user } = req;
  try {
    // Try to find user in DB
    let dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) {
      // Create user if not exists
      dbUser = await User.create({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.privateMetadata?.role || 'user',
      });
    }
    res.json({
      id: dbUser._id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      role: dbUser.role,
    });
  } catch (err) {
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
