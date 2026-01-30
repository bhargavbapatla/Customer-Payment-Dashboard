import type { ColumnDef } from "@tanstack/react-table"
import type { Customer } from "./schema"
import { Checkbox } from "../ui/checkbox"
import { Button } from "../ui/button"
import { MoreVertical, Info, Pencil, Trash } from "lucide-react"
import { Badge } from "../ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useStore } from "@/store/useUIStore"

const SortIcon = ({ className, sortState }: { className?: string; sortState?: false | "asc" | "desc" }) => (
    <svg width="10" height="10" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M4 0.5L7.5 4.5H0.5L4 0.5Z" fill={sortState === "asc" ? "#111827" : "#D1D5DB"} />
        <path d="M4 12.5L0.5 8.5H7.5L4 12.5Z" fill={sortState === "desc" ? "#111827" : "#D1D5DB"} />
    </svg>
)

const handleSort = (column: any) => {
    const currentSort = column.getIsSorted()
    if (currentSort === false) {
        column.toggleSorting(false) // Ascending
    } else if (currentSort === "asc") {
        column.toggleSorting(true) // Descending
    } else {
        column.clearSorting() // Default
    }
}

export const columns: ColumnDef<Customer>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => {
                    if (table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()) {
                        table.toggleAllPageRowsSelected(false)
                    } else {
                        table.toggleAllPageRowsSelected(!!value)
                    }
                }}
                aria-label="Select all"
                className="translate-y-[2px] bg-white border-gray-300 shadow-sm data-[state=checked]:bg-[#2264E5] data-[state=checked]:border-[#2264E5] data-[state=indeterminate]:bg-[#2264E5] data-[state=indeterminate]:border-[#2264E5]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px] bg-white border-gray-300 shadow-sm data-[state=checked]:bg-[#2264E5] data-[state=checked]:border-[#2264E5]"
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
                    onClick={() => handleSort(column)}
                    className="-ml-4 h-8 hover:bg-transparent"
                >
                    #
                    <SortIcon className="ml-2" sortState={column.getIsSorted()} />
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
                    onClick={() => handleSort(column)}
                    className="-ml-4 h-8 hover:bg-transparent uppercase text-[11px] font-semibold text-[#464F60]"
                >
                    NAME
                    <SortIcon className="ml-2" sortState={column.getIsSorted()} />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{row.original.name}</span>
                <span className="text-xs text-gray-500">{row.original.id}</span>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: () => <div className="uppercase text-[11px] font-semibold text-[#464F60]">DESCRIPTION</div>,
        cell: ({ row }) => <div className="text-gray-600 max-w-[300px] truncate">{row.getValue("description")}</div>,
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => handleSort(column)}
                    className="-ml-4 h-8 hover:bg-transparent uppercase text-[11px] font-semibold text-[#464F60]"
                >
                    STATUS
                    <SortIcon className="ml-2" sortState={column.getIsSorted()} />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const statusStyles: Record<string, string> = {
                Open: "bg-[#F0F1FA] text-[#4F5AED] hover:bg-[#F0F1FA]",
                Paid: "bg-[#E1FCEF] text-[#14804A] hover:bg-[#E1FCEF]",
                Inactive: "bg-[#E9EDF5] text-[#5A6376] hover:bg-[#E9EDF5]",
                Due: "bg-[#FAF0F3] text-[#D12953] hover:bg-[#FAF0F3]",
            }

            return (
                <Badge
                    variant="secondary"
                    className={`font-medium border-0 px-3 py-1 rounded-full ${statusStyles[status] || ""}`}
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "rate",
        header: () => <div className="text-right uppercase text-[11px] font-semibold text-[#464F60]">RATE</div>,
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
        header: () => <div className="text-right uppercase text-[11px] font-semibold text-[#464F60]">BALANCE</div>,
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
        header: () => <div className="text-right uppercase text-[11px] font-semibold text-[#464F60]">DEPOSIT</div>,
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
    {
        id: "actions",
        cell: ({ row }) => {
            const { openEditModal } = useStore()
            
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity"
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem className="text-blue-600 focus:text-blue-600 cursor-pointer">
                            <span className="flex-1 font-medium">View</span>
                            <Info className="ml-2 h-4 w-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="text-blue-600 focus:text-blue-600 cursor-pointer"
                            onClick={() => openEditModal(row.original)}
                        >
                            <span className="flex-1 font-medium">Edit</span>
                            <Pencil className="ml-2 h-4 w-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                            <span className="flex-1 font-medium">Delete</span>
                            <Trash className="ml-2 h-4 w-4" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]