// Import the express library
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Device = require('./models/device'); // Import the Device model

// Create an express application
const app = express();

// Define the port to run the server on
const PORT = 5000;
const mongoURI = 'mongodb://127.0.0.1:27017/myNewDatabase';
app.use(bodyParser.json());
app.use(cors());

// Database connection
// Establish a database connection
mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB', error));

// Define a route for the root of the app
app.get('/', (req, res) => {
  res.send('Smart Home Dashboard API is running!');
});

// Define a route to get the smart light state
// Route to get the smart light state
// Define a route to get the smart light state
app.get('/api/smart-light', async (req, res) => {
  try {
    const device = await Device.findOne({ name: 'Living Room Light' });
    if (!device) {
      return res.status(404).send('Device not found');
    }
    res.json(device);
  } catch (error) {
    console.error(error); // Log the full error
    res.status(500).json({ message: 'Error retrieving device', error: error.message });
  }
});

// Route to update the smart light state
app.post('/api/smart-light', async (req, res) => {
  try {
    const device = await Device.findOne({ name: 'Living Room Light' });
    console.log(device); // Add this line
    if (!device) {
      return res.status(404).send('Device not found');
    }
    device.status = device.status === 'on' ? 'off' : 'on';
    await device.save();
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error updating device', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});