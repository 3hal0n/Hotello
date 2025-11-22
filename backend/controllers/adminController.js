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
    // Get top hotels by booking count
    const mongoose = require('mongoose');
    const topHotelsData = await Bookings.aggregate([
      {
        $addFields: {
          hotelObjectId: { $toObjectId: '$hotelId' }
        }
      },
      {
        $group: {
          _id: '$hotelObjectId',
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'hotels',
          localField: '_id',
          foreignField: '_id',
          as: 'hotelDetails'
        }
      },
      { $unwind: { path: '$hotelDetails', preserveNullAndEmptyArrays: true } }
    ]);

    console.log('Top hotels aggregation result:', topHotelsData.length, 'hotels');
    if (topHotelsData.length > 0) {
      console.log('First aggregated hotel:', topHotelsData[0]);
    }
    
    const topHotels = topHotelsData.map(item => ({
      _id: item._id,
      name: item.hotelDetails?.name || 'Unknown Hotel',
      bookingCount: item.bookingCount
    }));
    
    console.log('Mapped top hotels:', topHotels);

    const [
      totalHotels,
      totalBookings,
      totalUsers,
      recentBookings
    ] = await Promise.all([
      Hotels.countDocuments(),
      Bookings.countDocuments(),
      Users.countDocuments(),
      Bookings.find()
        .populate('hotelId', 'name location')
        .populate('userId', 'clerkId')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
    ]);

    // Calculate revenue - only from paid bookings
    const paidBookingsCheck = await Bookings.find({ paymentStatus: 'paid' }).lean();
    console.log('Paid bookings count:', paidBookingsCheck.length);
    if (paidBookingsCheck.length > 0) {
      console.log('Sample paid booking amounts:', paidBookingsCheck.slice(0, 3).map(b => b.totalAmount));
    }
    
    const revenueData = await Bookings.aggregate([
      {
        $match: {
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          avgBookingValue: { $avg: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const revenue = revenueData[0] || { totalRevenue: 0, avgBookingValue: 0 };
    
    console.log('Revenue aggregation result:', revenueData);
    console.log('Extracted revenue:', revenue);
    
    // If no paid bookings, calculate from all bookings as fallback
    if (revenue.totalRevenue === 0 && totalBookings > 0) {
      console.log('No paid bookings found, checking all bookings...');
      const allRevenueData = await Bookings.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            avgBookingValue: { $avg: '$totalAmount' }
          }
        }
      ]);
      console.log('All bookings revenue:', allRevenueData);
      if (allRevenueData[0]) {
        revenue.totalRevenue = allRevenueData[0].totalRevenue;
        revenue.avgBookingValue = allRevenueData[0].avgBookingValue;
        console.log('Using fallback revenue:', revenue.totalRevenue);
      }
    }

    console.log('===== DASHBOARD STATS =====');
    console.log('Dashboard stats computed:', {
      totalHotels,
      totalBookings,
      totalUsers,
      totalRevenue: revenue.totalRevenue,
      recentBookingsCount: recentBookings.length,
      topHotelsCount: topHotels.length
    });
    
    if (recentBookings.length > 0) {
      console.log('Sample recent booking:', {
        id: recentBookings[0]._id,
        totalAmount: recentBookings[0].totalAmount,
        paymentStatus: recentBookings[0].paymentStatus,
        hotel: recentBookings[0].hotelId?.name
      });
    } else {
      console.log('⚠️ NO RECENT BOOKINGS FOUND IN DATABASE');
    }
    
    if (topHotels.length > 0) {
      console.log('Sample top hotel:', topHotels[0]);
    } else {
      console.log('⚠️ NO TOP HOTELS DATA (no bookings exist)');
    }
    
    console.log('===== END DASHBOARD STATS =====');

    const responseData = {
      totalHotels,
      totalBookings,
      totalUsers,
      totalRevenue: revenue.totalRevenue || 0,
      avgBookingValue: revenue.avgBookingValue || 0,
      recentBookings,
      topHotels
    };
    
    console.log('Sending response with totalRevenue:', responseData.totalRevenue);
    
    res.json({
      success: true,
      data: responseData
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
      .sort({ createdAt: -1 })
      .lean();
    
    // Enrich with user data from Users collection
    console.log('Total bookings found:', bookings.length);
    if (bookings.length > 0) {
      console.log('First booking userId:', bookings[0].userId);
    }
    
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const user = await Users.findOne({ clerkId: booking.userId }).lean();
        console.log(`Booking ${booking._id}: userId=${booking.userId}, found user:`, user ? user.name : 'NOT FOUND');
        
        // If user not in our DB, try to extract from Clerk ID or use placeholder
        let userDetails = null;
        if (user) {
          userDetails = { name: user.name, email: user.email };
        } else {
          // Use userId as identifier if no user found
          userDetails = { name: `User ${booking.userId.substring(0, 8)}`, email: booking.userId };
        }
        
        return {
          ...booking,
          userDetails
        };
      })
    );
    
    console.log('Enriched bookings sample:', enrichedBookings[0]);
    res.json({ success: true, data: enrichedBookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
  }
}

// Get all users (admin view)
async function getAllUsers(req, res) {
  try {
    const users = await Users.find().sort({ createdAt: -1 }).lean();
    
    // Calculate booking count for each user
    console.log('Total users found:', users.length);
    if (users.length > 0) {
      console.log('First user clerkId:', users[0].clerkId);
    }
    
    // First, get all unique userIds from bookings to understand what's in the DB
    const allBookings = await Bookings.find().lean();
    const uniqueUserIds = [...new Set(allBookings.map(b => b.userId))];
    console.log('Unique userIds in bookings:', uniqueUserIds);
    
    const usersWithBookings = await Promise.all(
      users.map(async (user) => {
        // The bookings.userId field stores the clerkId from Clerk authentication
        const bookingCount = await Bookings.countDocuments({ userId: user.clerkId });
        console.log(`User ${user.email}: clerkId=${user.clerkId}, bookings found=${bookingCount}`);
        
        // Also check if userId matches _id as fallback
        if (bookingCount === 0) {
          const altCount = await Bookings.countDocuments({ userId: user._id.toString() });
          console.log(`  Fallback check with _id: ${altCount} bookings`);
          return { ...user, bookingCount: altCount };
        }
        
        return { ...user, bookingCount };
      })
    );
    
    console.log('Users with bookings sample:', usersWithBookings[0]);
    res.json({ success: true, data: usersWithBookings });
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
