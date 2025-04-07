const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const ObjectModel = require('./models/Object'); // For MongoDB model

// Initialize the app
const app = express()

// Middleware
app.use(express.json())  // For parsing JSON bodies
app.use(cors())  // For enabling CORS

console.log('Initializing server...')

// MongoDB connection URI (for Docker container)
const mongoURI = 'mongodb://localhost:27017/barcodeDB'
console.log('MongoDB URI:', mongoURI)

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err))

// MongoDB Schema for a barcode document
const barcodeSchema = new mongoose.Schema({
  barId: { type: String, required: true },
  data: { type: String }  // Example of some data that could be stored alongside the barcode ID
})
console.log('Barcode schema initialized')

const Barcode = mongoose.model('Barcode', barcodeSchema)
console.log('Barcode model created')

// Express route to handle the barcode scan request
app.post('/get_object', async (req, res) => {
  console.log('Received request for /get_object:', req.body)
  let { barId } = req.body  // Extract BarID from request body
  
  if (!barId) {
    console.log('Request missing BarID')
    return res.status(400).json({ error: 'BarID is required' })
  }

  // Ensure barId is a string
  barId = String(barId)

  barId = String(barId).trim()

  try {
    console.log('Searching for BarID:', barId)
    // Find document in MongoDB that matches the BarID
    const doc = await Barcode.findOne({ barId })

    if (!doc) {
      console.log('No document found for BarID:', barId)
      return res.status(404).json({ error: 'Document not found' })
    }

    console.log('Found document:', doc)
    // Return the found document
    res.json(doc)
  } catch (err) {
    console.error('Error processing request:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Define your routes
app.post('/make_object', async (req, res) => {
  console.log('Received request to create object:', req.body)
  try {
    const { name, description, category, type, tags, size, barId } = req.body;

    // Validate the incoming data
    if (!name || !category || !type) {
      console.log('Validation failed: Missing required fields')
      return res.status(400).json({ error: 'Name, category, and type are required fields' });
    }

    // Ensure barId is a string
    const barIdString = String(barId);

    console.log('Creating new object with name:', name)
    // Create a new object entry
    const newObject = new ObjectModel({
      name,
      description,
      category,
      type,
      tags,
      size,
      barId: barIdString // Ensure the barId is a string
    });

    // Save to the database
    const savedObject = await newObject.save();
    console.log('Object created successfully:', savedObject)
    res.status(201).json({ message: 'Object created successfully', data: savedObject });
  } catch (error) {
    console.error('Error creating object:', error);
    res.status(500).json({ error: 'Server error' });
  }
})

// Start the server on port 5000
const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})