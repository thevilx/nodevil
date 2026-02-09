import mongoose, { Schema } from 'mongoose';
import { IVerificationRequest } from './verification_request';

const verificationRequestSchema = new Schema<IVerificationRequest>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    verificationCode: {
      type: String,
      required: true,
      length: 6,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index
    },
    resendCount: {
      type: Number,
      default: 1,
      max: 10, // Hard limit to prevent abuse
    },
    lastResendAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookups
verificationRequestSchema.index({ phoneNumber: 1, verificationCode: 1 });

// Index for cleanup operations
verificationRequestSchema.index({ lastResendAt: 1 });

const VerificationRequest = mongoose.model<IVerificationRequest>(
  'VerificationRequest',
  verificationRequestSchema
);

export default VerificationRequest;
