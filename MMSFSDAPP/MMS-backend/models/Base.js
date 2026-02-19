const mongoose = require('mongoose');

const BaseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  type: {
    type: String,
    enum: ['Army', 'Navy', 'AirForce', 'Joint', 'Training', 'Logistics'],
    required: true
  },
  capacity: { type: Number, required: true },
  currentOccupancy: { type: Number, default: 0 },
  commander: { type: mongoose.Schema.Types.ObjectId, ref: 'Soldier' },
  status: {
    type: String,
    enum: ['Operational', 'UnderConstruction', 'Decommissioned', 'Restricted'],
    default: 'Operational'
  },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  facilities: [{ type: String }],
  description: { type: String }
}, { timestamps: true });

BaseSchema.virtual('occupancyRate').get(function() {
  if (!this.capacity) return 0;
  return Math.round((this.currentOccupancy / this.capacity) * 100);
});

BaseSchema.set('toJSON', { virtuals: true });
BaseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Base', BaseSchema);
