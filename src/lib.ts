import {
  IClient,
  TransactionKind,
  Config
} from './types';

import {
  AuthService,
  IToken
} from './auth';


export default class Client implements IClient {
  credentials: IToken | undefined = undefined;

  constructor(
    private kind: TransactionKind,
    private config: Config,
    private authService: AuthService<Config>,
  ) {
    this.authService = new AuthService<Config>(this.config, this.kind)
  }

  /**
   * Authenticates client from config
   */
  async auth(): Promise<Client> {
    const {
      config
    } = this;
    if (!config) {
      throw new Error("No configuration found")
    }
    this.credentials = await this.authService.authenticate();
    return this;
  }

  requestToPay(body: any): boolean {
    // TODO: implemente request to pay
    return false;
  }

}
