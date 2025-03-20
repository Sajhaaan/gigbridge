const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Security middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all requests
app.use(limiter);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  }
});

// Constants
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gigbridge';

// MongoDB Connection with retry logic
const connectWithRetry = async () => {
  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };
  
  try {
    await mongoose.connect(MONGODB_URI, options);
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  // Attempt to reconnect
  setTimeout(connectWithRetry, 5000);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// Initial connection attempt
connectWithRetry();

// User Schema
const userSchema = new mongoose.Schema({
  userType: { type: String, required: true, enum: ['worker', 'hirer'] },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', messageSchema);

// Profile Schema
const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age: { type: Number, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  bio: String,
  skills: [String],
  experience: String,
  createdAt: { type: Date, default: Date.now }
});

const Profile = mongoose.model('Profile', profileSchema);

// Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password, userType } = req.body;

    // Validate input
    if (!fullName || !email || !password || !userType) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      userType
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          userType: user.userType
        },
        token
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          userType: user.userType
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Profile setup endpoint
app.post('/api/profile/setup', async (req, res) => {
  try {
    const { userId, age, location, phone, bio, skills, experience } = req.body;
    
    // Validate required fields
    if (!userId || !age || !location || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if profile already exists
    let profile = await Profile.findOne({ user: userId });
    
    if (profile) {
      // Update existing profile
      profile.age = age;
      profile.location = location;
      profile.phone = phone;
      profile.bio = bio || profile.bio;
      profile.skills = skills || profile.skills;
      profile.experience = experience || profile.experience;
    } else {
      // Create new profile
      profile = new Profile({
        user: userId,
        age,
        location,
        phone,
        bio: bio || '',
        skills: skills || [],
        experience: experience || ''
      });
    }

    // Save profile
    await profile.save();

    res.status(201).json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Profile setup error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log('User joined room:', userId);
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { senderId, receiverId, text } = data;
      
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        text: text
      });

      await message.save();

      // Emit to both sender and receiver
      io.to(senderId).emit('newMessage', message);
      io.to(receiverId).emit('newMessage', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Message Routes
app.post('/api/messages', async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      text: text
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
});

app.get('/api/messages/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    })
    .sort({ timestamp: 1 })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

app.get('/api/conversations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all messages where the user is either sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
    .sort({ timestamp: -1 })
    .populate('sender', 'fullName avatar')
    .populate('receiver', 'fullName avatar');

    // Group messages by conversation
    const conversations = [];
    const conversationMap = new Map();

    messages.forEach(message => {
      const otherUserId = message.sender._id.toString() === userId 
        ? message.receiver._id.toString()
        : message.sender._id.toString();

      if (!conversationMap.has(otherUserId)) {
        const otherUser = message.sender._id.toString() === userId 
          ? message.receiver 
          : message.sender;

        conversationMap.set(otherUserId, {
          _id: otherUserId,
          user: {
            _id: otherUser._id,
            name: otherUser.fullName,
            avatar: otherUser.avatar || 'https://via.placeholder.com/50'
          },
          lastMessage: {
            text: message.text,
            timestamp: message.timestamp,
            read: message.read
          }
        });
      }
    });

    conversations.push(...conversationMap.values());
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Error fetching conversations' });
  }
});

// Add basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Add error logging middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    await server.close();
    console.log('Graceful shutdown completed');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

// Start server with error handling
const startServer = async () => {
  try {
    await new Promise((resolve, reject) => {
      server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`MongoDB URI: ${MONGODB_URI}`);
        resolve();
      }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`Port ${PORT} is already in use`);
          process.exit(1);
        }
        reject(err);
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer(); 