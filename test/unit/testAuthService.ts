import { expect } from 'chai';
import { stub } from 'sinon';
import { AuthService } from '../../src/auth';
import { Config, TransactionKind } from '../../src/types';

const credentialsStub = {
  access_token: 'foobar',
  token_type: 'string',
  expires_in: 3600.
};

const configStub = <Config>{
  BASE_URL: 'https://momo.co.ug',
  API_USER: 'foo',
  API_KEY: 'blahblah',
  SUBSCRIPTION_KEY: 'blahblah'
};

const mockRequest = {
  post: stub().returns(credentialsStub)
}

let authService: AuthService<Config>;

describe('#AuthService', () => {

  describe('authenticate', () => {
    beforeEach(() => {
      authService = new AuthService(configStub, TransactionKind.Collection, mockRequest);
    });

    it('should return credentials on success', async () => {
      const expected = {
        bearer: credentialsStub.access_token,
        tokenType: credentialsStub.token_type,
        expiresIn: credentialsStub.expires_in,
      };
      expect(await authService.authenticate()).to.deep.equal(expected);
    });

    it('should make api call to authenticate client', async () => {
      await authService.authenticate();
      expect(mockRequest.post.called).to.equal(true)
    });

    it('should pick call uri for collection transaction', async () => {
      await authService.authenticate();
      expect(mockRequest.post.lastCall.args[0]['url']).to.equal('https://momo.co.ug/collection/token/')
    });

    it('should pick call uri for disbursement transaction', async () => {
      authService = new AuthService(configStub, TransactionKind.Disbursement, mockRequest);
      await authService.authenticate();
      expect(mockRequest.post.lastCall.args[0]['url']).to.equal('https://momo.co.ug/disbursement/token/')
    });

    it('should pick call uri for remittance transaction', async () => {
      authService = new AuthService(configStub, TransactionKind.Remittance, mockRequest);
      await authService.authenticate();
      expect(mockRequest.post.lastCall.args[0]['url']).to.equal('https://momo.co.ug/remittance/token/')
    });
  });
});