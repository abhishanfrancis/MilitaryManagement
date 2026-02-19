const mongoose = require('mongoose');

const SoldierSchema = new mongoose.Schema({
  serviceId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  rank: { type: mongoose.Schema.Types.ObjectId, ref: 'Rank', required: true },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },
  dateOfBirth: { type: Date },
  dateOfEnlistment: { type: Date, required: true },
  specialization: { type: String },
  status: {
    type: String,
    enum: ['Active', 'Deployed', 'OnLeave', 'Retired', 'Inactive'],
    default: 'Active'
  },
  contactEmail: { type: String },
  contactPhone: { type: String },
  notes: { type: String }
}, { timestamps: true });

SoldierSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

SoldierSchema.set('toJSON', { virtuals: true });
SoldierSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Soldier', SoldierSchema);
