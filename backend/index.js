const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/trips', require('./routes/trips'));
app.use('/api/parties', require('./routes/parties'));
app.use('/api/brokers', require('./routes/brokers'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/owners', require('./routes/owners'));
app.use('/api/labours', require('./routes/labours'));
app.use('/api/productReceives', require('./routes/productReceives'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});