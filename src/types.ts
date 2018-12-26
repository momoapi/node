import { IToken } from "./auth";

export enum TransactionKind {
  Collection = 1 << 0,
  Disbursement = 1 << 1,
  Remittance = 1 << 2
}

// TODO: add all supported currencies
export type Currency = 'USD'
  | 'UGX'
  | 'EUR';

export type Config = {
  BASE_URL: string
  API_KEY: string
  API_USER: string
  SUBSCRIPTION_KEY: string
}

export interface IClient {
  credentials: IToken | undefined;
}