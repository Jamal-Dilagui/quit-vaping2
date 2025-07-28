import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'first_puff',
        'three_day_streak',
        'goal_hit_three_days',
        'hundred_puffs_avoided',
        'week_streak',
        'month_streak',
        'zero_puffs_day',
        'goal_master'
      ],
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate badges
badgeSchema.index({ userId: 1, type: 1 }, { unique: true });

export default mongoose.models.Badge || mongoose.model('Badge', badgeSchema); 