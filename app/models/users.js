import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // NextAuth Default Fields
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      select: false
    },
    // Custom Fields for Vape App
    quitDate: {
      type: Date,
      default: null
    },
    dailyPuffLimit: { 
        type: Number, 
        default: 200 
    }, // Customizable goal
    currentStreak: { 
        type: Number, 
        default: 0 
    }, // For achievements
    
    // NextAuth Provider Data
    accounts: [
      {
        provider: String,
        providerAccountId: String,
        type: String,
        access_token: String,
        expires_at: Number,
        scope: String,
      },
    ],
    sessions: [
      {
        sessionToken: String,
        expires: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);