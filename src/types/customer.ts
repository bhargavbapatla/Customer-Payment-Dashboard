export type PaymentStatus = 'Paid' | 'Due' | 'Open' | 'Inactive';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  description: string;
  status: PaymentStatus;
  rate: number;
  balance: number;
  deposit: number;
}

export interface IFieldMeta {
    name: string;
    label: string;
    type: "textField" | "textAreaField" | "selectField" | "numberField";
    isRequired: boolean;
    placeholder?: string;
    options?: string[];
}