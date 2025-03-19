const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 8000;

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/gigbridge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Middleware
app.use(cors());
app.use(express.json());

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
    const { userType, fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      userType,
      fullName,
      email,
      password: hashedPassword,
    });

    // Save user
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'your-secret-key', // Replace with environment variable in production
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        userType: user.userType,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({
      user: {
        id: user._id,
        userType: user.userType,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Profile setup endpoint
app.post('/api/profile/setup', async (req, res) => {
  try {
    const { age, location, phone, bio, skills, experience } = req.body;
    
    // Validate required fields
    if (!age || !location || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new profile
    const newProfile = {
      id: profiles.length + 1,
      age,
      location,
      phone,
      bio: bio || '',
      skills: skills || [],
      experience: experience || '',
      createdAt: new Date(),
    };

    // Save profile
    profiles.push(newProfile);

    res.status(201).json({
      message: 'Profile created successfully',
      profile: newProfile,
    });
  } catch (error) {
    console.error('Profile setup error:', error);
    res.status(500).json({ message: 'Error creating profile' });
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('API URL:', `http://localhost:${PORT}/api`);
}); 