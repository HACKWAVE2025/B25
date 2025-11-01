const mongoose = require('mongoose');
const User = require('../models/User');
const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const { audit } = require('../middleware/auditHook');

// POST /api/prescriptions
// body: { consultationRef, medications:[{name,dosage,frequency,duration,instructions}], notes }
async function createPrescription(req, res, next) {
  try {
    const doctor = await User.findById(req.user.id);
    if (!doctor || doctor.role !== 'doctor') return res.status(403).json({ message: 'Forbidden' });

    const hospitalId = doctor.hospitalId;
    const { consultationRef, medications = [], notes = '' } = req.body;
    const ref = String(consultationRef || '').trim();

    let cons = null;
    if (mongoose.isValidObjectId(ref)) {
      cons = await Consultation.findOne({ _id: ref, hospitalId }).lean();
    } else {
      cons = await Consultation.findOne({ consultationId: ref, hospitalId }).lean();
    }
    if (!cons) return res.status(404).json({ message: 'Consultation not found' });
    if (String(cons.doctorId) !== String(doctor._id) || cons.status !== 'in_progress') {
      return res.status(400).json({ message: 'Consultation must be in progress by you' });
    }

    // Upsert single prescription per consultation
    const prescription = await Prescription.findOneAndUpdate(
      { consultationId: cons._id },
      {
        $set: {
          consultationId: cons._id,
          patientId: cons.patientId,
          doctorId: doctor._id,
          medications,
          notes,
          digitalSignature: {
            doctorName: `${doctor.profile.firstName} ${doctor.profile.lastName}`,
            qualification: doctor.profile.qualification || '',
            signedAt: new Date()
          },
          isUnlocked: true
        }
      },
      { new: true, upsert: true }
    );

    await audit(req.user, 'create_prescription', 'prescription', prescription._id, { consultationId: cons._id }, req.ip);
    res.status(201).json({ id: prescription._id });
  } catch (err) { next(err); }
}

// GET /api/prescriptions/by-consultation/:ref
async function getByConsultation(req, res, next) {
  try {
    const ref = String(req.params.ref).trim();
    let cons = null;
    if (mongoose.isValidObjectId(ref)) cons = await Consultation.findById(ref).lean();
    else cons = await Consultation.findOne({ consultationId: ref }).lean();
    if (!cons) return res.status(404).json({ message: 'Consultation not found' });

    const pr = await Prescription.findOne({ consultationId: cons._id }).lean();
    if (!pr) return res.status(404).json({ message: 'Prescription not found' });
    pr.consultationIdHuman = cons.consultationId;
    res.json(pr);
  } catch (err) { next(err); }
}

module.exports = { createPrescription, getByConsultation };
