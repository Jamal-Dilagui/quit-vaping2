import mongoose from 'mongoose';

const puffLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    count: {
      type: Number,
      required: true,
      min: 1,
    },
    trigger: {
      type: String,
      enum: ['stress', 'boredom', 'social', 'habit', 'other'],
      default: 'other',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for efficient queries
puffLogSchema.index({ userId: 1, date: 1 });

export default mongoose.models.PuffLog || mongoose.model('PuffLog', puffLogSchema);