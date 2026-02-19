const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['Vehicle', 'Weapon', 'Communication', 'Medical', 'Engineering', 'Aviation', 'Ammunition', 'Other'],
    required: true
  },
  category: { type: String },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },
  assignedUnit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  assignedSoldier: { type: mongoose.Schema.Types.ObjectId, ref: 'Soldier' },
  status: {
    type: String,
    enum: ['Operational', 'UnderMaintenance', 'Damaged', 'Decommissioned', 'InTransit'],
    default: 'Operational'
  },
  condition: {
    type: String,
    enum: ['New', 'Good', 'Fair', 'Poor', 'Critical'],
    default: 'Good'
  },
  quantity: { type: Number, default: 1 },
  acquisitionDate: { type: Date },
  lastMaintenanceDate: { type: Date },
  nextMaintenanceDate: { type: Date },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', EquipmentSchema);
