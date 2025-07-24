const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
  },
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  raterType: {
    type: String,
    enum: ['driver', 'passenger'],
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: 500,
    trim: true
  },
  categories: {
    punctuality: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    cleanliness: { type: Number, min: 1, max: 5 },
    safety: { type: Number, min: 1, max: 5 },
    overall: { type: Number, min: 1, max: 5 }
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'reported'],
    default: 'active'
  },
  helpfulVotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    helpful: Boolean
  }],
  response: {
    message: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Compound index to ensure one rating per user per ride
ratingSchema.index({ ride: 1, ratedBy: 1 }, { unique: true });
ratingSchema.index({ ratedUser: 1, createdAt: -1 });
ratingSchema.index({ rating: 1 });

// Calculate helpful score
ratingSchema.virtual('helpfulScore').get(function() {
  if (!this.helpfulVotes.length) return 0;
  const helpful = this.helpfulVotes.filter(vote => vote.helpful).length;
  return helpful / this.helpfulVotes.length;
});

module.exports = mongoose.model('Rating', ratingSchema);
