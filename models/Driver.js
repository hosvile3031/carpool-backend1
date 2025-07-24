const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driverSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  vehicle: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    licensePlate: { type: String, required: true, unique: true },
    color: { type: String, required: true },
    image: { type: String, default: null }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  ridesCompleted: {
    type: Number,
    default: 0
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Driver', driverSchema);
