// models/Object.js
const mongoose = require('mongoose');

const ObjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  category: { type: String, required: true },
  type: { type: String, required: true },
  tags: { type: String, required: false },
  size: { type: String, required: false },
  barId: { type: String, required: false },
});

const ObjectModel = mongoose.model('Object', ObjectSchema);

module.exports = ObjectModel;
