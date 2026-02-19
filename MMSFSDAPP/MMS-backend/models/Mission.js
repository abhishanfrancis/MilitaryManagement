const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['Combat', 'Reconnaissance', 'Peacekeeping', 'Training', 'Humanitarian', 'Logistics', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['Planning', 'Active', 'Completed', 'Cancelled', 'OnHold'],
    default: 'Planning'
  },
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  description: { type: String },
  location: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  commander: { type: mongoose.Schema.Types.ObjectId, ref: 'Soldier' },
  assignedUnits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' }],
  requiredEquipment: [{
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
    quantity: { type: Number, default: 1 }
  }],
  personnelCount: { type: Number, default: 0 },
  objectives: [{ type: String }],
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Mission', MissionSchema);
