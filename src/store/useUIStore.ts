import { create } from 'zustand';
import {
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  type Updater 
} from "@tanstack/react-table";
import type { Customer } from '@/types/customer';

interface AppState {
  isModalOpen: boolean;
  isViewMode: boolean;
  editingCustomer: Customer | null;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  globalFilter: string;
  openAddModal: () => void;
  openEditModal: (customer: Customer) => void;
  openViewModal: (customer: Customer) => void;
  closeModal: () => void;
  setSorting: (updater: Updater<SortingState>) => void;
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void;
  setColumnVisibility: (updater: Updater<VisibilityState>) => void;
  setRowSelection: (updater: Updater<RowSelectionState>) => void;
  setGlobalFilter: (updater: Updater<string>) => void;
  resetTableState: () => void;
  getSelectedRowIds: () => string[];
}

const functionalUpdate = <T>(updater: Updater<T>, old: T): T => {
  return typeof updater === 'function' 
    ? (updater as (old: T) => T)(old) 
    : updater;
};

export const useStore = create<AppState>((set, get) => ({
  isModalOpen: false,
  isViewMode: false,
  editingCustomer: null,
  sorting: [],
  columnFilters: [],
  columnVisibility: {},
  rowSelection: {},
  globalFilter: "",
  openAddModal: () => set({ isModalOpen: true, editingCustomer: null, isViewMode: false }),
  openEditModal: (customer) => set({ isModalOpen: true, editingCustomer: customer, isViewMode: false }),
  openViewModal: (customer) => set({ isModalOpen: true, editingCustomer: customer, isViewMode: true }),
  closeModal: () => set({ isModalOpen: false, editingCustomer: null, isViewMode: false }),
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

  getSelectedRowIds: () => Object.keys(get().rowSelection),
}));