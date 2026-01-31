export type Customer = {
    id: string
    name: string
    phone: string
    description: string
    status: "Open" | "Paid" | "Inactive" | "Due"
    rate: number
    balance: number
    deposit: number
}