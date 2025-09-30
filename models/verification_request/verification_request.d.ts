import { Types } from 'mongoose';

export interface IVerificationRequest {
  _id?: Types.ObjectId;
  phoneNumber: string;
  verificationCode: string;
  expiresAt: Date;
  resendCount: number;
  lastResendAt: Date;
  attempts: number;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}
