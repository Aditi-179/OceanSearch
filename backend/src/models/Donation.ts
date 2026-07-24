import mongoose, { Schema, Document } from "mongoose";

export interface IDonation extends Document {
  amount: number;
  unlockedBadge: string;
  createdAt: Date;
}

const DonationSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  unlockedBadge: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDonation>("Donation", DonationSchema);
