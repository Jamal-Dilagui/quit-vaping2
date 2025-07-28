import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    tier: {
      type: Number,
      default: 1
    },
    category: {
      type: String,
      enum: ['streak', 'reduction', 'tracking', 'milestone'],
      required: true
    },
    progress: {
      current: {
        type: Number,
        default: 0
      },
      target: {
        type: Number,
        required: true
      }
    },
    unlockedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema);