const mongoose = require('mongoose');

const objectSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  type: String,
  tags: [String],
  size: String,
  barcodeId: String, // Unique ID for the barcode
});

const ObjectModel = mongoose.model('Object', objectSchema);

module.exports = ObjectModel;
