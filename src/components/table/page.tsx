import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Filter,
    Plus,
    Search,
    Trash
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

// --- Data Type Definition ---
import { useStore } from "@/store/useUIStore"
import { CustomerModal } from "./CustomerModal"
import { columns } from "./columns"
import data from "./data"



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

    const table = useReactTable({
        data,
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
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Filter Button */}
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
                                table.getRowModel().rows.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className={`
                                            group
                                            border-b border-gray-50 
                                            hover:bg-[#EBF0FA]
                                            data-[state=selected]:bg-[#F0F6FF] 
                                            data-[state=selected]:shadow-[inset_4px_0_0_0_#2264E5]
                                            ${index % 2 === 1 ? 'bg-[#F9FAFC]' : 'bg-white'}
                                        `}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-4 align-top">
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
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="sticky bottom-0 z-40 flex items-center justify-between border-t border-gray-100 pt-4 bg-white/40 backdrop-blur-md p-6 -mx-6 -mb-6">
                    {/* Left: Range Indicator */}
                    <div className="text-sm text-gray-500 font-medium">
                        {table.getFilteredRowModel().rows.length > 0 ? (
                            <>
                                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                    table.getFilteredRowModel().rows.length
                                )} of {table.getFilteredRowModel().rows.length}
                            </>
                        ) : (
                            "0-0 of 0"
                        )}
                    </div>

                    {/* Right: Controls */}
                    <div className="flex items-center gap-6">
                        {/* Rows per page */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 font-medium">Rows per page:</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 text-gray-600 font-medium hover:bg-transparent">
                                        {table.getState().pagination.pageSize}
                                        <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {[5, 10, 15, 20, 30, 40, 50].map((pageSize) => (
                                        <DropdownMenuItem
                                            key={pageSize}
                                            onClick={() => table.setPageSize(pageSize)}
                                            className={`${table.getState().pagination.pageSize === pageSize ? "bg-gray-100 font-medium" : ""}`}
                                        >
                                            {pageSize}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Pagination Buttons */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-lg border-gray-200"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronLeft className="h-4 w-4 text-gray-500" />
                            </Button>
                            
                            <span className="text-sm text-gray-600 font-medium min-w-[3rem] text-center">
                                {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
                            </span>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-lg border-gray-200"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <CustomerModal />
        </div>
    )
}

export default DataTable
