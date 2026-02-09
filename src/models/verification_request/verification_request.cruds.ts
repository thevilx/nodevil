import { IVerificationRequest } from './verification_request';
import VerificationRequest from './verification_request.schema';
import { Crud } from '../crud';

class VerificationRequestCrudClass extends Crud<IVerificationRequest> {
  constructor() {
    super(VerificationRequest, 'verification-request-not-found');
  }
}

export const VerificationRequestCrud = new VerificationRequestCrudClass();
