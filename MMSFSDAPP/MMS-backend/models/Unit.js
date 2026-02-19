const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['Infantry', 'Armor', 'Artillery', 'Engineering', 'Signal', 'Medical', 'Logistics', 'Special Forces', 'Aviation', 'Other'],
    required: true
  },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },
  commander: { type: mongoose.Schema.Types.ObjectId, ref: 'Soldier' },
  parentUnit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  capacity: { type: Number, default: 100 },
  currentStrength: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Active', 'Deployed', 'StandBy', 'Disbanded'],
    default: 'Active'
  },
  description: { type: String },
  establishedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Unit', UnitSchema);
