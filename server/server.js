const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ObjectModel = require('./models/Object'); // Import your schema
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

console.log('Initializing server...');

// MongoDB connection URI (for Docker container)
const mongoURI = 'mongodb://localhost:27017/barcodeDB'
console.log('MongoDB URI:', mongoURI)

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err))
  
app.post('/create', async (req, res) => {
  console.log('Received POST request to /create:', req.body);
  try {
    const { name, description, category, type, tags, size } = req.body;
    const barcodeId = generateBarcodeId(); // Generate barcode ID (you can use a library like `bwip-js` to generate barcode)
    console.log('Generated barcodeId:', barcodeId);

    const newObject = new ObjectModel({ name, description, category, type, tags, size, barcodeId });
    await newObject.save();
    console.log('Successfully saved new object:', newObject);

    res.status(200).json(newObject);
  } catch (err) {
    console.error('Error in /create endpoint:', err);
    res.status(500).json({ message: 'Error creating object', error: err });
  }
});

app.get('/scan/:barcodeId', async (req, res) => {
  console.log('Received GET request to /scan:', req.params);
  try {
    const { barcodeId } = req.params;
    const object = await ObjectModel.findOne({ barcodeId });
    console.log('Found object:', object);

    if (!object) {
      console.log('No object found for barcodeId:', barcodeId);
      return res.status(404).json({ message: 'Object not found' });
    }

    res.status(200).json(object);
  } catch (err) {
    console.error('Error in /scan endpoint:', err);
    res.status(500).json({ message: 'Error scanning barcode', error: err });
  }
});

// Generate a barcode ID (could be any string or number)
function generateBarcodeId() {
  const id = Math.random().toString(36).substring(7);
  console.log('Generated new barcode ID:', id);
  return id;
}

app.listen(5000, () => console.log('Server running on http://localhost:5000'));