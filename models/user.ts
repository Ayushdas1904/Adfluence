  import mongoose from "mongoose";

  const UserSchema = new mongoose.Schema({
    youtubeId: { type: String, unique: true }, // YouTube User ID (not Channel ID)
    channelId: { type: String, unique: true, sparse: true }, // YouTube Channel ID
    channelName: { type: String }, // Channel Name
    profilePicture: { type: String }, // Profile Picture URL
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Number, required: true }, // Store expiry timestamp

    niche: { type: String, required: true }, // Niche of the creator (e.g., Gaming, Beauty, etc.)

    // ✅ YouTube Insights
    subscriberCount: { type: String },
    viewCount: { type: String },
    videoCount: { type: String },

    // ✅ Login state
    isLoggedIn: { type: Boolean, default: false },
  }, { strict: true, _id: false });

  export const User = mongoose.models.User || mongoose.model("User", UserSchema);
