const mongoose = require('mongoose');

// Define the device schema
const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['on', 'off']
  }
});

// Create a model from the schema
const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
