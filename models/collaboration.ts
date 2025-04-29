import mongoose from "mongoose";

const collaborationSchema = new mongoose.Schema(
  {
    creatorId: { type: String, ref : "User", required: true }, // keep String
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "inProgress", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    
    },
    agreementDetails: { type: String },
  },
  { timestamps: true }
);

// 💥 Correct way to refresh model
export const Collaboration = mongoose.models?.Collaboration || mongoose.model('Collaboration', collaborationSchema);

export default Collaboration;
