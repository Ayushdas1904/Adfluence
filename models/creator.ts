import mongoose, { Schema, Document } from "mongoose";

interface ICreator extends Document {
  userId: string;
  username: string;
  accountType: string;
  mediaCount: number;
  profilePictureUrl: string;
  insights: {
    followerCount: number;
    impressions: number;
    reach: number;
    engagement: number;
  };
}

const CreatorSchema = new Schema<ICreator>({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  accountType: { type: String, required: true },
  mediaCount: { type: Number, required: true },
  profilePictureUrl: { type: String, required: true },
  insights: {
    followerCount: { type: Number, required: true },
    impressions: { type: Number, required: true },
    reach: { type: Number, required: true },
    engagement: { type: Number, required: true },
  },
});

export default mongoose.models.Creator || mongoose.model<ICreator>("Creator", CreatorSchema);
