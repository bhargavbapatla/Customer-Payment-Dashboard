import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"
import {
    ChevronLeft,
    ChevronRight,
    Filter,
    Inbox,
    Plus,
    Search,
    Trash
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// --- Data Type Definition ---
import { useStore } from "@/store/useUIStore"
import { CustomerModal } from "./CustomerModal"
import { columns } from "./columns"
// import data from "./data"
import { Spinner } from "@/components/ui/spinner"
import { useCustomers, useDeleteCustomers } from "@/hooks/useCustomers"
import { useState } from "react"
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog"



const DataTable = () => {
    const {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        globalFilter,
        setSorting,
        setColumnFilters,
        setColumnVisibility,
        setRowSelection,
        setGlobalFilter,
        openAddModal,
        openEditModal
    } = useStore()

    const { data: customers } = useCustomers()
    const { mutateAsync: deleteCustomers, isPending: isDeleting } = useDeleteCustomers()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)


    const table = useReactTable({
        data: customers || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    })

    const handleDeleteSelected = async () => {
        const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id)
        await deleteCustomers(selectedIds)
        setShowDeleteDialog(false)
        table.resetRowSelection()
    }

    return (
        <div className="w-full p-8 space-y-6 bg-white-50 min-h-screen">
            <div className="bg-white p-7 rounded-xl shadow-sm border relative">
                {/* Toolbar */}
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
                                    onClick={() => setShowDeleteDialog(true)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Filter Button */}
                                <DropdownMenu>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="icon" className="h-10 w-10">
                                                    <Filter className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Filter</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuCheckboxItem
                                            checked={table.getColumn("status")?.getFilterValue() === undefined}
                                            onCheckedChange={() => table.getColumn("status")?.setFilterValue(undefined)}
                                        >
                                            All Status
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

                                {/* Search Input */}
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

                    {/* Add Customer Button */}
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-4 w-full md:w-auto"
                        disabled={table.getFilteredSelectedRowModel().rows.length > 1}
                        onClick={() => {
                            if (table.getFilteredSelectedRowModel().rows.length === 1) {
                                openEditModal(table.getFilteredSelectedRowModel().rows[0].original)
                            } else {
                                openAddModal()
                            }
                        }}
                    >
                        {table.getFilteredSelectedRowModel().rows.length === 1 ? (
                            "Update customer"
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Add customer
                            </>
                        )}
                    </Button>
                </div>

                {/* Table Structure */}
                {/* <div className="rounded-none border-0 pb-4"> */}
                <div className="-mx-6">
                    <table className="w-full caption-bottom text-sm">
                        <TableHeader className="sticky top-[89px] z-30 bg-white/40 backdrop-blur-md shadow-sm">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="border-b border-gray-100 hover:bg-transparent">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="h-12 bg-transparent first:rounded-l-lg last:rounded-r-lg">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="border-b border-gray-50 hover:bg-[#EBF0FA] transition-colors group"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        {customers ? (
                                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                                <div className="bg-gray-50 p-4 rounded-full mb-3">
                                                    <Inbox className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <p className="text-base font-medium">No customers found</p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Add a new customer to get started
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <Spinner className="h-6 w-6 text-blue-600" />
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredRowModel().rows.length > 0 ? (
                            <>
                                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                                {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of{" "}
                                {table.getFilteredRowModel().rows.length}
                            </>
                        ) : (
                            "0 of 0"
                        )}
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2">
                            <p className="text-xs font-medium text-[#687182]">Rows per page:</p>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="cursor-pointer"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="text-sm font-medium">
                                {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="cursor-pointer"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            <CustomerModal />

            <DeleteConfirmationDialog 
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleDeleteSelected}
                isDeleting={isDeleting}
                description={`Are you sure you want to delete ${table.getFilteredSelectedRowModel().rows.length} selected item(s)? This action cannot be undone.`}
            />
        </div>
    )
}

export default DataTable
