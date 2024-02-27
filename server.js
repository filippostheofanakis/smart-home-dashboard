// Import the express library
const express = require('express');
const bodyParser = require('body-parser');


// Create an express application
const app = express();

// Define the port to run the server on
const PORT = 3000;

app.use(bodyParser.json());


let smartLight = {
  id: 1,
  name: "Living Room Light",
  isOn: false // Light is initially off
};

// Define a route for the root of the app
app.get('/', (req, res) => {
  res.send('Smart Home Dashboard API is running!');

  app.get('/api/smart-light', (req, res) => {
    res.json(smartLight);
  })
});

app.post('/api/smart-light', (req, res) => {
  const { isOn } = req.body;// Extract the new state from the request's body
  smartLight.isOn = isOn; // Update the smart light's state
  res.json({ message: `Smart light turned ${isOn ? 'on' : 'off'}.`, smartLight });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
