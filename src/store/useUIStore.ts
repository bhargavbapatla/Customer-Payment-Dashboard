import { create } from 'zustand';
import {
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  type Updater // Import this to handle TanStack's functional updates
} from "@tanstack/react-table";
import type { Customer } from '@/types/customer';

// --- 1. Define the Combined State Interface ---
interface AppState {
  // === UI Slice ===
  isModalOpen: boolean;
  isViewMode: boolean; // Add this
  editingCustomer: Customer | null;
  
  // === Table Slice ===
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  globalFilter: string;

  // === Actions ===
  // UI Actions
  openAddModal: () => void;
  openEditModal: (customer: Customer) => void;
  openViewModal: (customer: Customer) => void; // Add this
  closeModal: () => void;
  
  // Table Actions
  setSorting: (updater: Updater<SortingState>) => void;
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void;
  setColumnVisibility: (updater: Updater<VisibilityState>) => void;
  setRowSelection: (updater: Updater<RowSelectionState>) => void;
  setGlobalFilter: (updater: Updater<string>) => void;
  resetTableState: () => void;

  // === Computed / Helpers ===
  // This replaces the need for a separate 'selectedRowIds' state
  getSelectedRowIds: () => string[];
}

// Helper for TanStack functional updates
const functionalUpdate = <T>(updater: Updater<T>, old: T): T => {
  return typeof updater === 'function' 
    ? (updater as (old: T) => T)(old) 
    : updater;
};

// --- 2. Create the Unified Store ---
export const useStore = create<AppState>((set, get) => ({
  // --- Initial State ---
  isModalOpen: false,
  isViewMode: false, // Initialize
  editingCustomer: null,
  sorting: [],
  columnFilters: [],
  columnVisibility: {},
  rowSelection: {}, // The source of truth for selection
  globalFilter: "",

  // --- UI Actions ---
  openAddModal: () => set({ isModalOpen: true, editingCustomer: null, isViewMode: false }),
  openEditModal: (customer) => set({ isModalOpen: true, editingCustomer: customer, isViewMode: false }),
  openViewModal: (customer) => set({ isModalOpen: true, editingCustomer: customer, isViewMode: true }), // Add this
  closeModal: () => set({ isModalOpen: false, editingCustomer: null, isViewMode: false }),

  // --- Table Actions ---
  setSorting: (updater) => 
    set((state) => ({ sorting: functionalUpdate(updater, state.sorting) })),
  
  setColumnFilters: (updater) => 
    set((state) => ({ columnFilters: functionalUpdate(updater, state.columnFilters) })),
  
  setColumnVisibility: (updater) => 
    set((state) => ({ columnVisibility: functionalUpdate(updater, state.columnVisibility) })),
  
  setRowSelection: (updater) => 
    set((state) => ({ rowSelection: functionalUpdate(updater, state.rowSelection) })),
  
  setGlobalFilter: (updater) => 
    set((state) => ({ globalFilter: functionalUpdate(updater, state.globalFilter) })),

  resetTableState: () => set({
    sorting: [],
    columnFilters: [],
    columnVisibility: {},
    rowSelection: {},
    globalFilter: ""
  }),

  // --- Helper ---
  // Converts { "1": true, "abc": true } -> ["1", "abc"]
  getSelectedRowIds: () => Object.keys(get().rowSelection),
}));