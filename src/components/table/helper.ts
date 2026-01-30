import type { Customer, IFieldMeta } from "@/types/customer"
import * as Yup from "yup"


export const fieldMeta: IFieldMeta[] = [
    { name: "name", label: "Name", type: "textField", isRequired: true, placeholder: "Enter customer name" },
    { name: "description", label: "Description", type: "textAreaField", isRequired: false, placeholder: "Enter customer description" },
    { name: "status", label: "Status", type: "selectField", isRequired: true, options: ["Open", "Paid", "Inactive", "Due"] },
    { name: "rate", label: "Rate", type: "numberField", isRequired: true, placeholder: "Enter customer rate" },
    { name: "balance", label: "Balance", type: "numberField", isRequired: true, placeholder: "Enter customer balance" },
    { name: "deposit", label: "Deposit", type: "numberField", isRequired: true, placeholder: "Enter customer deposit" }, 
]

export const validationSchema =  Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().optional(),
    status: Yup.string().oneOf(["Open", "Paid", "Inactive", "Due"]).required("Status is required"),
    rate: Yup.number().typeError("Rate must be a number").transform((value, originalValue) => (String(originalValue).trim() === "" ? undefined : value)).min(0, "Rate must be positive").required("Rate is required"),
    balance: Yup.number().typeError("Balance must be a number").transform((value, originalValue) => (String(originalValue).trim() === "" ? undefined : value)).required("Balance is required"),
    deposit: Yup.number().typeError("Deposit must be a number").transform((value, originalValue) => (String(originalValue).trim() === "" ? undefined : value)).min(0, "Deposit must be positive").required("Deposit is required"),
})

export const customerInitialValues = {
    name: "",
    description: "",
    status: "",
    rate: "",
    balance: "",
    deposit: "",
}
