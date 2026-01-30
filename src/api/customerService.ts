import type { Customer } from "@/types/customer";


// Mock Data
let customers: Customer[] = [
  { id: "1", name: "John Doe", description: "Web Dev", status: "Paid", rate: 85.0, balance: 0.0, deposit: 500.0 }
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    await delay(800); // Simulate network latency to show off your Loading Skeletons
    return [...customers];
  },

  add: async (customer: Omit<Customer, "id">): Promise<Customer> => {
    await delay(500);
    const newCustomer = { ...customer, id: Math.random().toString(36).substr(2, 9) };
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