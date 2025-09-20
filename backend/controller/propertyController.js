import Property from "../models/Property.js";
import Booking from "../models/Booking.js";

// Create new property with multiple images
export const createProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    
    // Parse JSON strings back to arrays if they exist
    if (typeof propertyData.features === 'string') {
      propertyData.features = JSON.parse(propertyData.features);
    }
    
    if (typeof propertyData.availability === 'string') {
      propertyData.availability = JSON.parse(propertyData.availability);
    }
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      // Create image URLs from uploaded files
      propertyData.images = req.files.map(file => {
        return `http://localhost:5001/uploads/${file.filename}`;
      });
    }
    
    const property = new Property(propertyData);
    const savedProperty = await property.save();
    
    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: savedProperty
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all properties (with filtering)
export const getProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10, city, propertyType, minPrice, maxPrice, status } = req.query;
    
    let filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (propertyType) filter.propertyType = propertyType;
    if (status) filter.status = status;
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }
    
    const properties = await Property.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Property.countDocuments(filter);
    
    res.json({
      success: true,
      data: properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get only approved properties for public listing
export const getApprovedProperties = async (req, res) => {
  try {
    const { page = 1, limit = 9, city, propertyType, minPrice, maxPrice } = req.query;
    
    let filter = { status: 'approved' };
    if (city) filter.city = new RegExp(city, 'i');
    if (propertyType) filter.propertyType = propertyType;
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }
    
    const properties = await Property.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Property.countDocuments(filter);
    
    res.json({
      success: true,
      data: properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get property by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    
    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update property
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    
    res.json({
      success: true,
      message: "Property updated successfully",
      data: property
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update property status (approve/reject)
export const updatePropertyStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'approved' or 'rejected'"
      });
    }
    
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes: adminNotes || '' },
      { new: true, runValidators: true }
    );
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    
    res.json({
      success: true,
      message: `Property ${status} successfully`,
      data: property
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    
    res.json({
      success: true,
      message: "Property deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get properties by owner
export const getPropertiesByOwner = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.params.ownerId });
    res.json({
      success: true,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get statistics for admin dashboard
export const getPropertyStats = async (req, res) => {
  try {
    const total = await Property.countDocuments();
    const pending = await Property.countDocuments({ status: 'pending' });
    const approved = await Property.countDocuments({ status: 'approved' });
    const rejected = await Property.countDocuments({ status: 'rejected' });
    
    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all bookings for a specific property (for hotel owners)
export const getPropertyBookings = async (req, res) => {
  try {
    const { id } = req.params;
    
    const bookings = await Booking.find({ propertyId: id })
      .populate('userId', 'firstName lastName email phone')
      .populate('propertyId', 'title city pricePerNight')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update booking status (for hotel owners to approve/reject bookings)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status'
      });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('userId', 'firstName lastName email')
     .populate('propertyId', 'title city');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};