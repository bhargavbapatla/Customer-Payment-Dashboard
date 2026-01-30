import { create } from 'zustand';
import type { Customer } from '@/types/customer';

interface UIState {
  isModalOpen: boolean;
  editingCustomer: Customer | null; // null = Add Mode, Object = Edit Mode
  selectedRowIds: string[]; // For bulk delete
  
  openAddModal: () => void;
  openEditModal: (customer: Customer) => void;
  closeModal: () => void;
  setSelectedRows: (ids: string[]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  editingCustomer: null,
  selectedRowIds: [],

  openAddModal: () => set({ isModalOpen: true, editingCustomer: null }),
  openEditModal: (customer) => set({ isModalOpen: true, editingCustomer: customer }),
  closeModal: () => set({ isModalOpen: false, editingCustomer: null }),
  setSelectedRows: (ids) => set({ selectedRowIds: ids }),
}));