const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// MongoDB Connection Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rgadmin:Radha14901985@rglibrary.ednmaca.mongodb.net/mine0305';
const PORT = process.env.PORT || 3001;

// Routes
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payment');


app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);


const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected to MongoDB');
    
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();