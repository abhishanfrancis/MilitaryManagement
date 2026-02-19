const mongoose = require('mongoose');

const RankSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  abbreviation: { type: String, required: true },
  level: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Enlisted', 'NCO', 'Officer', 'General'],
    required: true
  },
  description: { type: String },
  payGrade: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Rank', RankSchema);
