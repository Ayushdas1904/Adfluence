import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  website: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  document: { type: String, required: true }, // Cloudinary URL
  verified: { type: Boolean, default: false }, // Admin verification
  isLoggedIn: { type: Boolean, default: false }, // For session management
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Business || mongoose.model("Business", BusinessSchema);
