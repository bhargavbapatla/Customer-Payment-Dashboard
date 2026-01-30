import { Table } from "@tanstack/react-table";
import { Filter, Plus, Search, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/useUIStore"; // Connecting your Zustand store
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import React from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const openAddModal = useStore((state) => state.openAddModal);


  return (
    <div className="sticky top-0 z-40 flex items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-6 -mx-6 -mt-6 border-b border-gray-100">
      <div className="flex items-center gap-3 flex-1">
        {table.getFilteredSelectedRowModel().rows.length > 1 ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">
              {table.getFilteredSelectedRowModel().rows.length} selected
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-gray-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 shadow-sm transition-colors"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuCheckboxItem
                  checked={table.getColumn("status")?.getFilterValue() === undefined}
                  onCheckedChange={() => table.getColumn("status")?.setFilterValue(undefined)}
                >
                  All Statuses
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={table.getColumn("status")?.getFilterValue() === "Open"}
                  onCheckedChange={() => table.getColumn("status")?.setFilterValue("Open")}
                >
                  Open
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={table.getColumn("status")?.getFilterValue() === "Paid"}
                  onCheckedChange={() => table.getColumn("status")?.setFilterValue("Paid")}
                >
                  Paid
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={table.getColumn("status")?.getFilterValue() === "Inactive"}
                  onCheckedChange={() => table.getColumn("status")?.setFilterValue("Inactive")}
                >
                  Inactive
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-9 h-10 bg-gray-50/50 border-gray-200"
              />
            </div>
          </>
        )}
      </div>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-4">
        <Plus className="mr-2 h-4 w-4" />
        Add customer
      </Button>
    </div>
  );
}