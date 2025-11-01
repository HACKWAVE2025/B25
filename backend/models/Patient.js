// backend/models/Patient.js
const mongoose = require('mongoose');
const Counter = require('./Counter');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    age:       { type: Number, required: true },
    gender:    { type: String, enum: ['male','female','other'], required: true },
    email:     String,
    phone:     { type: String, required: true },
    height:    Number,
    weight:    Number
  },
  conditionType: { type: String, enum: ['skin','wound','other'], default: 'other' },
  photos: [{ url: String, publicId: String, uploadedAt: Date }],
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Auto-generate patientId using a counter to avoid race conditions
patientSchema.pre('validate', async function(next) {
  if (this.patientId) return next();
  try {
    const c = await Counter.findOneAndUpdate(
      { key: 'patient' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const n = c.seq;
    this.patientId = `PAT${String(n).padStart(6, '0')}`;
    next();
  } catch (e) {
    next(e);
  }
});

module.exports = mongoose.model('Patient', patientSchema);
