const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  origin: {
    address: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  destination: {
    address: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  departureTime: {
    type: Date,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  pricePerSeat: {
    type: Number,
    required: true,
    min: 0
  },
  passengers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    seatsBooked: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    bookingTime: {
      type: Date,
      default: Date.now
    },
    paymentReference: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed', 'in-progress'],
    default: 'active'
  },
  notes: String,
  route: {
    distance: String,
    duration: String,
    polyline: String
  }
}, {
  timestamps: true
});

// Index for geospatial queries
rideSchema.index({ 'origin.coordinates': '2dsphere' });
rideSchema.index({ 'destination.coordinates': '2dsphere' });
rideSchema.index({ departureTime: 1 });
rideSchema.index({ status: 1 });

// Virtual for remaining seats
rideSchema.virtual('remainingSeats').get(function() {
  const bookedSeats = this.passengers.reduce((total, passenger) => {
    return passenger.status === 'confirmed' ? total + passenger.seatsBooked : total;
  }, 0);
  return this.availableSeats - bookedSeats;
});

module.exports = mongoose.model('Ride', rideSchema);
