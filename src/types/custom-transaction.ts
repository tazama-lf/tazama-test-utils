export type CustomTransaction = {
  firstSetTime: number;
  currency: string;
  amount: number;
  description: string;
  status: string;
  debtorAge: number;
  transactionType: string;
  latitude: number;
  longitude: number;
};

export type PartialCustomTransaction = Partial<CustomTransaction>;
