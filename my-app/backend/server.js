//server.js
// Import the express library
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const Device = require('./models/device'); // Import the Device model

// Create an express application
const app = express();

// Replace with your smart plug's local IP address
const SMART_PLUG_IP =  'localhost:3001';

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
    const device = await Device.findOne({ name: '2'  });
    if (!device) {
      return res.json({ name: '2', status: 'off', message: 'Device not found' });
    }
    res.json(device);
  } catch (error) {
    console.error(error); // Log the full error
    res.status(500).json({ message: 'Error retrieving device', error: error.message });
  }
});

app.post('/api/smart-plug', async (req, res) => {
  try {
    const device = await Device.findOne({ name: 'Smart Plug' });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    device.status = device.status === 'on' ? 'off' : 'on';
    await device.save();

    // Send a request to the mock server to change the plug state
    const plugResponse = await axios.put(`http://${SMART_PLUG_IP}/smart-plug`, { status: device.status });

    // Check the response from the mock server
    if (plugResponse.status !== 200) {
      throw new Error('Failed to update the plug state');
    }

    res.json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating device', error: error.message });
  }
});

// Route to update the smart light state
app.post('/api/smart-light', async (req, res) => {
  try {
    const device = await Device.findOne({ name: '2' });
    if (!device) {
      // Return a default response when no device is found
      return res.status(404).json({ message: 'Device not found' });
    }
    device.status = device.status === 'on' ? 'off' : 'on';
    await device.save();
    res.json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating device', error: error.message });
  }
});

// POST endpoint to add a new device
app.post('/api/devices', async (req, res) => {
  try {
    const { name, status } = req.body;
    let device = new Device({ name, status });

    await device.save();
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error adding device', error });
  }
});

// PUT endpoint to toggle a device's status
app.put('/api/devices/:id/toggle', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Find the device by id and update its status
    const updatedDevice = await Device.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }


     // Make a request to the smart plug API to update the plug status
     const plugResponse = await axios.put(`http://${SMART_PLUG_IP}/smart-plug`, { status });

    // Check the response from the smart plug API
     if (plugResponse.status !== 200) {
       throw new Error('Failed to update the plug state');
     }

    res.json(updatedDevice);
  } catch (error) {
    console.error('Error toggling device status:', error);
    res.status(500).json({ message: 'Error toggling device status', error: error.message });
  }
});

app.post('/api/devices/:deviceId/toggle', async (req, res) => {
  const { deviceId } = req.params;
  const device = await findDeviceInDatabase(deviceId); // Custom function to find the device in your DB
  if (!device) {
    return res.status(404).send('Device not found');
  }

  try {
    // Assuming `toggleDevice` is a function that makes an API call to the smart device
    const response = await toggleDevice(device.apiIdentifier, req.body.status);
    res.json(response);
  } catch (error) {
    console.error('Error toggling device:', error);
    res.status(500).send('Failed to toggle device');
  }
});

// GET endpoint to retrieve all devices
app.get('/api/devices', async (req, res) => {
  try {
    const devices = await Device.find({});
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error });
  }
});

// DELETE endpoint to remove a device
app.delete('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.findByIdAndDelete(id);

    if (!device) {
      return res.status(404).send('Device not found');
    }

    res.status(200).send(`Device ${id} deleted`);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting device', error });
  }
});

// PUT endpoint to update a device's name and status
app.put('/api/devices/:id', async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  try {
    // Find the device by id and update it with the name and status from the request body
    // The { new: true } option ensures that the updated document is returned
    const updatedDevice = await Device.findByIdAndUpdate(id, { name, status }, { new: true });

    if (!updatedDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(updatedDevice);
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({ message: 'Error updating device', error: error.message });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});