export type PaymentStatus = 'Paid' | 'Due' | 'Open' | 'Inactive';

export interface Customer {
  id: string;
  name: string;
  description: string;
  status: PaymentStatus;
  rate: number;
  balance: number;
  deposit: number;
}