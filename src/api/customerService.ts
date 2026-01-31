import type { Customer } from "@/types/customer";


let customers: Customer[] = [];

// adding delay to simulate API response

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    await delay(800);
    return [...customers];
  },

  add: async (customer: Omit<Customer, "id">): Promise<Customer> => {
    await delay(500);
    const maxId = customers.reduce((max, c) => Math.max(max, parseInt(c.id) || 0), 0);
    const newId = (maxId + 1).toString();
    
    const newCustomer = { ...customer, id: newId };
    customers.push(newCustomer);
    return newCustomer;
  },

  update: async (updatedCustomer: Customer): Promise<Customer> => {
    await delay(500);
    customers = customers.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c));
    return updatedCustomer;
  },

  delete: async (ids: string[]): Promise<void> => {
    await delay(500);
    customers = customers.filter((c) => !ids.includes(c.id));
  },
};