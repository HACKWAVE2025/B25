const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  amount: { type: Number, required: true }, // amount in rupees
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paidAt: { type: Date }
}, { timestamps: true });

// idempotent export to avoid OverwriteModelError when hot-reloading/tests run
module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
