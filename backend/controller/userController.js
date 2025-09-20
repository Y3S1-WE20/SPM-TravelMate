import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import mongoose from "mongoose";

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 20, page = 1 } = req.query;

    // Get user details to search by email as well
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Search both by userId and email to cover all cases
    const filter = {
      $or: [
        { userId: userId },
        { 'guestInfo.email': user.email }
      ]
    };
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('propertyId', 'title city images pricePerNight location')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get user's booking statistics
export const getUserBookingStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Booking.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalSpent: { $sum: '$totalCost' }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments({ userId });
    const totalSpent = await Booking.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$totalCost' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        totalSpent: totalSpent[0]?.total || 0,
        statusBreakdown: stats
      }
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking statistics',
      error: error.message
    });
  }
};

// Get user's favorite properties
export const getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate({
        path: 'favorites',
        match: { status: 'approved' },
        select: 'title city images pricePerNight propertyType features'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user.favorites || []
    });
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message
    });
  }
};

// Add property to favorites
export const addToFavorites = async (req, res) => {
  try {
    const { userId, propertyId } = req.params;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Add to favorites if not already there
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: propertyId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property added to favorites',
      data: { favorites: user.favorites }
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to favorites',
      error: error.message
    });
  }
};

// Remove property from favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const { userId, propertyId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: propertyId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property removed from favorites',
      data: { favorites: user.favorites }
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from favorites',
      error: error.message
    });
  }
};