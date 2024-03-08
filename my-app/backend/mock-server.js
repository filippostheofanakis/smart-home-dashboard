import express from 'express';
const app = express();
app.use(express.json());

let smartPlugStatus = 'off';

app.get('/smart-plug', (req, res) => {
  console.log('GET request received at /smart-plug');
  res.json({ status: smartPlugStatus });
});

app.put('/smart-plug', (req, res) => {
  const { status } = req.body;
  smartPlugStatus = status;
  console.log(`PUT request received at /smart-plug. New status: ${status}`);
  res.json({ status: smartPlugStatus });
});

app.listen(3001, () => {
  console.log('Mock server is running on http://localhost:3001');
});