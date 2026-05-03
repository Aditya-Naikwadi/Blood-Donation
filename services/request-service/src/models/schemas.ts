import mongoose, { Schema, Document } from 'mongoose';

export interface IBloodRequest extends Document {
  patientName: string;
  bloodType: string;
  units: number;
  urgency: 'CRITICAL' | 'HIGH' | 'NORMAL';
  hospital: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'OPEN' | 'MATCHED' | 'FULFILLED' | 'EXPIRED';
  requestedBy: string;
  matchedDonors: string[];
  createdAt: Date;
  expiresAt: Date;
}

const BloodRequestSchema: Schema = new Schema({
  patientName: { type: String, required: true },
  bloodType: { type: String, required: true },
  units: { type: Number, required: true },
  urgency: { type: String, enum: ['CRITICAL', 'HIGH', 'NORMAL'], default: 'NORMAL' },
  hospital: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { type: String, enum: ['OPEN', 'MATCHED', 'FULFILLED', 'EXPIRED'], default: 'OPEN' },
  requestedBy: { type: String, required: true },
  matchedDonors: [{ type: String }],
  expiresAt: { type: Date, default: () => new Date(Date.now() + 72 * 60 * 60 * 1000) } // 72 hours
}, { timestamps: true });

export const BloodRequest = mongoose.model<IBloodRequest>('BloodRequest', BloodRequestSchema);

export interface ICampaign extends Document {
  title: string;
  organizer: string;
  targetUnits: number;
  location: string;
  startDate: Date;
  endDate: Date;
  registrations: string[];
}

const CampaignSchema: Schema = new Schema({
  title: { type: String, required: true },
  organizer: { type: String, required: true },
  targetUnits: { type: Number, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registrations: [{ type: String }]
}, { timestamps: true });

export const Campaign = mongoose.model<ICampaign>('Campaign', CampaignSchema);
