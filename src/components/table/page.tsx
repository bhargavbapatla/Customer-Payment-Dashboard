import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table"
import {
    ArrowUpDown,
    Filter,
    Search,
    Plus
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// --- Data Type Definition ---
export type Customer = {
    id: string
    name: string
    phone: string
    description: string
    status: "Open" | "Paid" | "Inactive"
    rate: number
    balance: number
    deposit: number
}

// --- Sample Data ---
const data: Customer[] = [
    {
        id: "1",
        name: "Ann Culhane",
        phone: "5684236526",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
        status: "Open",
        rate: 70.00,
        balance: -270.00,
        deposit: 500.00
    },
    {
        id: "2",
        name: "Ahmad Rosser",
        phone: "5684236527",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
        status: "Paid",
        rate: 70.00,
        balance: 270.00,
        deposit: 500.00
    },
    {
        id: "3",
        name: "Zain Calzoni",
        phone: "5684236528",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
        status: "Open",
        rate: 70.00,
        balance: -20.00,
        deposit: 500.00
    },
    {
        id: "4",
        name: "Leo Stanton",
        phone: "5684236529",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
        status: "Inactive",
        rate: 70.00,
        balance: 600.00,
        deposit: 500.00
    },
    {
        id: "5",
        name: "Kaiya Vetrovs",
        phone: "5684236530",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
        status: "Open",
        rate: 70.00,
        balance: -350.00,
        deposit: 500.00
    },
]

// --- Columns Configuration ---
export const columns: ColumnDef<Customer>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px] data-[state=checked]:bg-[#2264E5] data-[state=checked]:border-[#2264E5]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px] data-[state=checked]:bg-[#2264E5] data-[state=checked]:border-[#2264E5]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 h-8 hover:bg-transparent"
                >
                    #
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 h-8 hover:bg-transparent uppercase text-xs font-bold text-gray-500"
                >
                    NAME
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{row.original.name}</span>
                <span className="text-xs text-gray-500">{row.original.phone}</span>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: () => <div className="uppercase text-xs font-bold text-gray-500">DESCRIPTION</div>,
        cell: ({ row }) => <div className="text-gray-600 max-w-[300px] truncate">{row.getValue("description")}</div>,
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 h-8 hover:bg-transparent uppercase text-xs font-bold text-gray-500"
                >
                    STATUS
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant="secondary"
                    className={`
            font-medium border-0 px-3 py-1 rounded-full
            ${status === 'Open' ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : ''}
            ${status === 'Paid' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : ''}
            ${status === 'Inactive' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : ''}
          `}
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "rate",
        header: () => <div className="text-right uppercase text-xs font-bold text-gray-500">RATE</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("rate"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "CAD", // Using CAD based on image
            }).format(amount)
            return (
                <div className="text-right flex flex-col">
                    <span className="font-medium text-gray-700">{formatted}</span>
                    <span className="text-[10px] text-gray-400">CAD</span>
                </div>
            )
        },
    },
    {
        accessorKey: "balance",
        header: () => <div className="text-right uppercase text-xs font-bold text-gray-500">BALANCE</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("balance"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "CAD",
            }).format(amount)
            
            const isNegative = amount < 0
            const isPositive = amount > 0
            
            return (
                <div className="text-right flex flex-col">
                    <span className={`font-medium ${isNegative ? 'text-red-500' : isPositive ? 'text-emerald-500' : 'text-gray-700'}`}>
                        {formatted}
                    </span>
                    <span className="text-[10px] text-gray-400">CAD</span>
                </div>
            )
        },
    },
    {
        accessorKey: "deposit",
        header: () => <div className="text-right uppercase text-xs font-bold text-gray-500">DEPOSIT</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("deposit"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "CAD",
            }).format(amount)
            return (
                <div className="text-right flex flex-col">
                    <span className="font-medium text-gray-700">{formatted}</span>
                    <span className="text-[10px] text-gray-400">CAD</span>
                </div>
            )
        },
    },
]

// --- Main Table Component ---
const DataTable = () => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")

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
        <div className="w-full p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
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
                    </div>

                    {/* Add Customer Button */}
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Add customer
                    </Button>
                </div>

                {/* Table Structure */}
                <div className="rounded-none border-0">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="border-b border-gray-100 hover:bg-transparent">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="h-12 bg-gray-50/30 first:rounded-l-lg last:rounded-r-lg">
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
                                            border-b border-gray-50 
                                            hover:bg-gray-100 
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
                    </Table>
                </div>

                {/* Pagination (Optional, but good to keep) */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="text-sm text-gray-500">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DataTable
