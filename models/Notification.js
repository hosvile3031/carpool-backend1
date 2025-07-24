const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  type: {
    type: String,
    enum: [
      'ride_booked',
      'ride_cancelled',
      'ride_confirmed',
      'ride_started',
      'ride_completed',
      'payment_received',
      'driver_verified',
      'rating_received',
      'system_announcement',
      'ride_reminder'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  deliveryChannel: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  deliveryStatus: {
    email: { 
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    },
    push: { 
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    },
    sms: { 
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
