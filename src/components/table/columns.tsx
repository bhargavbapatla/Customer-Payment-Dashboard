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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "../ui/tooltip"
import { useStore } from "@/store/useUIStore"
import { useDeleteCustomers } from "@/hooks/useCustomers"
import { useState } from "react"
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog"

// --- Components ---
const ActionsCell = ({ row }: { row: any }) => {
    const { openEditModal, openViewModal } = useStore()
    const { mutateAsync: deleteCustomer, isPending: isDeleting } = useDeleteCustomers()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleDelete = async () => {
        await deleteCustomer([row.original.id])
        setShowDeleteDialog(false)
    }

    return (
        <>
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity"
                            >
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4 text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Actions</p>
                    </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem 
                        className="text-[#4B85FA] focus:text-[#4B85FA] cursor-pointer"
                        onClick={() => openViewModal(row.original)}
                    >
                        <span className="flex-1 font-medium">View</span>
                        <Info className="ml-2 h-4 w-4 fill-[#4B85FA] text-white" />
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="text-[#4B85FA] focus:text-[#4B85FA] cursor-pointer"
                        onClick={() => openEditModal(row.original)}
                    >
                        <span className="flex-1 font-medium">Edit</span>
                        <Pencil className="ml-2 h-4 w-4 fill-[#4B85FA] text-white" />
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                        onSelect={() => {
                            setShowDeleteDialog(true)
                        }}
                    >
                        <span className="flex-1 font-medium">Delete</span>
                        <Trash className="ml-2 h-4 w-4" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteConfirmationDialog 
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                description="Are you sure you wanna delete this item, it cannot be undone."
            />
        </>
    )
}

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

// --- Helper for Currency ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CAD",
        currencyDisplay: "narrowSymbol",
    }).format(amount)
}

// --- Columns Definition ---
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
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => handleSort(column)}
                className="-ml-4 h-8 hover:bg-transparent"
            >
                #
                <SortIcon className="ml-2" sortState={column.getIsSorted()} />
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => handleSort(column)}
                className="-ml-4 h-8 hover:bg-transparent uppercase text-[11px] font-semibold text-[#464F60]"
            >
                NAME
                <SortIcon className="ml-2" sortState={column.getIsSorted()} />
            </Button>
        ),
        cell: ({ row }) => (
            // UPDATE: Removed 'truncate', added 'whitespace-normal' and 'break-words'
            <div className="flex flex-col max-w-[150px]">
                <span className="font-semibold text-gray-900 whitespace-normal break-words">
                    {row.original.name}
                </span>
                <span className="text-xs text-gray-500">{row.original.id}</span>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: () => <div className="uppercase text-[11px] font-semibold text-[#464F60]">DESCRIPTION</div>,
        cell: ({ row }) => (
            // UPDATE: Removed 'line-clamp', added 'whitespace-normal' and 'break-words'
            <div 
                className="text-gray-600 max-w-[250px] whitespace-normal break-words"
            >
                {row.getValue("description")}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => handleSort(column)}
                className="-ml-4 h-8 hover:bg-transparent uppercase text-[11px] font-semibold text-[#464F60]"
            >
                STATUS
                <SortIcon className="ml-2" sortState={column.getIsSorted()} />
            </Button>
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const statusStyles: Record<string, string> = {
                Open: "bg-[#F0F1FA] text-[#4F5AED]",
                Paid: "bg-[#E1FCEF] text-[#14804A]",
                Inactive: "bg-[#E9EDF5] text-[#5A6376]",
                Due: "bg-[#FAF0F3] text-[#D12953]",
            }

            return (
                <Badge
                    variant="secondary"
                    className={`font-medium border-0 px-3 py-1 rounded-full whitespace-nowrap ${statusStyles[status] || ""}`}
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
            return (
                <div className="text-right flex flex-col whitespace-nowrap">
                    <span className="font-medium text-gray-700">{formatCurrency(amount)}</span>
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
            const isNegative = amount < 0
            const isPositive = amount > 0
            
            return (
                <div className="text-right flex flex-col whitespace-nowrap">
                    <span className={`font-medium ${isNegative ? 'text-red-500' : isPositive ? 'text-emerald-500' : 'text-gray-700'}`}>
                        {formatCurrency(amount)}
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
            return (
                <div className="text-right flex flex-col whitespace-nowrap">
                    <span className="font-medium text-gray-700">{formatCurrency(amount)}</span>
                    <span className="text-[10px] text-gray-400">CAD</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell row={row} />,
    },
]