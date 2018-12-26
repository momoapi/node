import { Config, TransactionKind } from './types';

export type IToken = {
  bearer: string;
  tokenType: 'string' | /**TODO: explicitly define token types instead of */any;
  expiresIn: number;
}

type RequestHeaders = {
  [key: string]: string | number
}

export class AuthService<T extends Config>{

  constructor(
    private config: T,
    private kind: TransactionKind,
    private request = require('request-promise')
  ) {
  }

  /**
   * Autheticates client
   */
  async authenticate(): Promise<IToken> {
    const {
      API_KEY,
      API_USER,
      BASE_URL
    } = this.config;

    let requestUrl: string;

    switch (this.kind) {
      case TransactionKind.Collection:
        requestUrl = '/collection'
        break;
      case TransactionKind.Disbursement:
        requestUrl = '/disbursement'
        break;
      case TransactionKind.Remittance:
        requestUrl = '/remittance'
        break;
      default:
        requestUrl = ''
    }

    const requestHeaders =
      <RequestHeaders>{
        Authorization: 'Basic ' + Buffer.from(API_USER + ':' + API_KEY).toString('base64'),
      }

    const response = await this.request.post({
      url: BASE_URL + requestUrl + '/token/',
      headers: requestHeaders,
    }) as any;

    return {
      bearer: response.access_token,
      tokenType: response.token_type,
      expiresIn: response.expires_in,
    }
  }
}

