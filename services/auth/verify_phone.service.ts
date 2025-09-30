import crypto from 'crypto';
import { BadRequestError } from '../../utils/errors';
import { i18n } from '../../config/i18n/i18n';
import { RoleService } from '../role.service';
import { IRolesEnum } from '../../models/role/roles.enum';
import { IVerificationRequest } from '../../models/verification_request/verification_request';
import { VerificationRequestCrud } from '../../models/verification_request/verification_request.cruds';
import VerificationRequest from '../../models/verification_request/verification_request.schema';
import { IUser } from '../../models/user/user';
import { UserCrud } from '../../models/user/user.cruds';

export class VerificationService {
  private static readonly CODE_EXPIRY_MINUTES = 15;
  private static readonly MAX_RESEND_PER_HOUR = 3;
  private static readonly RESEND_COOLDOWN_MINUTES = 5;

  /**
   * Generate a 6-digit verification code
   */
  private static generateCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Format phone number to E.164 format
   */
  static formatPhoneNumber(phoneNumber: string, defaultCountryCode: string = '+1'): string {
    const cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.length > 10) {
      return '+' + cleaned;
    }

    if (cleaned.length === 10) {
      return defaultCountryCode + cleaned;
    }

    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }

    return phoneNumber;
  }

  /**
   * Validate phone number format
   */
  static isValidPhoneNumber(phoneNumber: string): boolean {
    return /^\+[1-9]\d{1,14}$/.test(phoneNumber);
  }

  /**
   * Check if verification request can be resent
   */
  private static canResendCode(verificationRequest: IVerificationRequest) {
    const now = new Date();

    // Check cooldown period
    const cooldownExpiry = new Date(
      verificationRequest.lastResendAt.getTime() + this.RESEND_COOLDOWN_MINUTES * 60 * 1000
    );
    if (now < cooldownExpiry) {
      const minutes = Math.ceil((cooldownExpiry.getTime() - now.getTime()) / 1000 / 60);

      throw new BadRequestError(
        i18n.t('please-wait-x-minutes-before-requesting-new-verification-code', {
          minutes,
        })
      );
    }

    // Check hourly limit
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    if (
      verificationRequest.lastResendAt > oneHourAgo &&
      verificationRequest.resendCount >= this.MAX_RESEND_PER_HOUR
    ) {
      throw new BadRequestError(i18n.t('too-many-verification-attempts'));
    }
  }

  /**
   * Send verification code (initial registration or resend)
   */
  static async sendVerificationCode(phoneNumber: string) {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      if (!this.isValidPhoneNumber(formattedPhone)) {
        throw new BadRequestError(i18n.t('invalid-phone-number-format'));
      }

      const code = this.generateCode();
      const expiresAt = new Date(Date.now() + this.CODE_EXPIRY_MINUTES * 60 * 1000);
      const now = new Date();

      let verificationRequest = await VerificationRequest.findOne({ phoneNumber: formattedPhone });

      if (verificationRequest) {
        // Existing verification request
        this.canResendCode(verificationRequest);

        // Reset resend count if it's been over an hour
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const resendCount =
          verificationRequest.lastResendAt > oneHourAgo ? verificationRequest.resendCount + 1 : 1;

        await VerificationRequestCrud.updateById(verificationRequest._id.toString(), {
          verificationCode: code,
          expiresAt: expiresAt,
          resendCount: resendCount,
          lastResendAt: now,
        });
      } else {
        // New verification request
        verificationRequest = await VerificationRequest.create({
          phoneNumber: formattedPhone,
          verificationCode: code,
          expiresAt,
          resendCount: 1,
          lastResendAt: now,
        });
      }

      // Send SMS with verification code
      await this.sendSMS(formattedPhone, code);

      return code;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify the code and create user account
   */
  static async verifyCode(phoneNumber: string, code: string) {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const verificationRequest = await VerificationRequestCrud.tryFindOne({
        phoneNumber: formattedPhone,
        verificationCode: code,
      });

      if (!verificationRequest) {
        throw new BadRequestError(i18n.t('invalid-validation-code'));
      }

      // Check if expired
      if (verificationRequest.expiresAt < new Date()) {
        await VerificationRequest.deleteOne({ _id: verificationRequest._id });
        throw new BadRequestError(i18n.t('verification-code-expired'));
      }

      // check if the user exist :

      const user: IUser | null = await UserCrud.tryFindOne({ phone_number: formattedPhone });

      await VerificationRequest.deleteOne({ _id: verificationRequest._id });

      if (user) {
        return {
          user: user,
          should_update_profile: !user.finishedRegistration,
        };
      } else {
        const userRole = await RoleService.getRoleByName(IRolesEnum.CUSTOMER);

        const user = await UserCrud.create({
          full_name: '',
          role: userRole._id,
          phone_number: formattedPhone,
          password: undefined,
        });

        return {
          user: user,
          should_update_profile: true,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Clean up expired verification requests (run periodically)
   */
  static async cleanupExpiredRequests(): Promise<void> {
    // MongoDB TTL will handle most cleanup, but we can also manually clean old blocked requests
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await VerificationRequest.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { isBlocked: true, lastResendAt: { $lt: oneDayAgo } },
      ],
    });
  }

  /**
   * Send SMS with verification code
   */
  private static async sendSMS(phoneNumber: string, code: string): Promise<void> {
    console.log(`Sending verification code ${code} to ${phoneNumber}`);

    // Implement with your SMS service (Twilio, AWS SNS, etc.)
    // Example with Twilio:
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: `Your verification code is: ${code}. This code expires in 15 minutes.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber
    // });
  }
}
