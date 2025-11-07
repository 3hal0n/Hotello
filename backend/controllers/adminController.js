const Admin = require('../models/Admin');
const Hotels = require('../models/Hotels');
const Bookings = require('../models/Bookings');
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Admin login
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    // Find admin
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        username: admin.username, 
        role: admin.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Login error', error: error.message });
  }
}

// Get dashboard statistics
async function getDashboardStats(req, res) {
  try {
    const [
      totalHotels,
      totalBookings,
      totalUsers,
      recentBookings,
      topHotels
    ] = await Promise.all([
      Hotels.countDocuments(),
      Bookings.countDocuments(),
      Users.countDocuments(),
      Bookings.find()
        .populate('hotelId', 'name location')
        .populate('userId', 'clerkId')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Hotels.find()
        .sort({ rating: -1 })
        .limit(5)
        .lean()
    ]);

    // Calculate revenue
    const revenueData = await Bookings.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          avgBookingValue: { $avg: '$totalPrice' }
        }
      }
    ]);

    const revenue = revenueData[0] || { totalRevenue: 0, avgBookingValue: 0 };

    res.json({
      success: true,
      data: {
        totalHotels,
        totalBookings,
        totalUsers,
        totalRevenue: revenue.totalRevenue,
        avgBookingValue: revenue.avgBookingValue,
        recentBookings,
        topHotels
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats', error: error.message });
  }
}

// Get all hotels (admin view)
async function getAllHotels(req, res) {
  try {
    const hotels = await Hotels.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: hotels });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({ success: false, message: 'Error fetching hotels', error: error.message });
  }
}

// Create hotel
async function createHotel(req, res) {
  try {
    const hotelData = req.body;
    const hotel = new Hotels(hotelData);
    await hotel.save();
    res.status(201).json({ success: true, data: hotel });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({ success: false, message: 'Error creating hotel', error: error.message });
  }
}

// Update hotel
async function updateHotel(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const hotel = await Hotels.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    
    res.json({ success: true, data: hotel });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({ success: false, message: 'Error updating hotel', error: error.message });
  }
}

// Delete hotel
async function deleteHotel(req, res) {
  try {
    const { id } = req.params;
    
    const hotel = await Hotels.findByIdAndDelete(id);
    
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    
    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({ success: false, message: 'Error deleting hotel', error: error.message });
  }
}

// Get all bookings (admin view)
async function getAllBookings(req, res) {
  try {
    const bookings = await Bookings.find()
      .populate('hotelId', 'name location pricePerNight')
      .populate('userId', 'clerkId')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
  }
}

// Get all users (admin view)
async function getAllUsers(req, res) {
  try {
    const users = await Users.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
}

module.exports = {
  login,
  getDashboardStats,
  getAllHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  getAllBookings,
  getAllUsers
};
