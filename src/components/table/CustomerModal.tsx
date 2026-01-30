import { Field, FormikProvider, useFormik, type FieldProps } from "formik"
import { useEffect } from "react"
import { useStore } from "../../store/useUIStore"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { customerInitialValues, fieldMeta, validationSchema } from "./helper"
import type { IFieldMeta, Customer } from "@/types/customer"
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/useCustomers"


export function CustomerModal() {
    const { isModalOpen, closeModal, editingCustomer } = useStore()
    const { mutateAsync: createCustomer } = useCreateCustomer()
    const { mutateAsync: updateCustomer } = useUpdateCustomer()

    const formik = useFormik({
        initialValues: customerInitialValues,
        validationSchema,
        onSubmit: async (values) => {
            if (editingCustomer) {
                await updateCustomer({ ...values, id: editingCustomer.id } as Customer)
            } else {
                await createCustomer(values as unknown as Omit<Customer, "id">)
            }
            closeModal()
        },
    })

    const renderFields = (fieldConfig: IFieldMeta) => {
        switch (fieldConfig.type) {
            case "textField":
                return renderTextField(fieldConfig)
            case "selectField":
                return renderSelectField(fieldConfig)
            case "numberField":
                return renderNumberField(fieldConfig)
            case "textAreaField":
                return renderTextAreaField(fieldConfig)
            default:
                return null
        }
    }

    const renderTextAreaField = (fieldConfig: IFieldMeta) => (
        <div className="col-span-3">
            <Field name={fieldConfig.name}>
                {({ field, form, meta }: FieldProps) => (
                    <>
                        <label htmlFor={fieldConfig.name} className="block text-sm font-medium text-gray-700">
                            {fieldConfig.label}
                        </label>
                        <Textarea
                            id={fieldConfig.name}
                            {...formik.getFieldProps(fieldConfig.name)}
                            className={meta.touched && meta.error ? "border-red-500" : ""}
                            placeholder={fieldConfig.placeholder}
                        />
                        {meta.touched && meta.error && (
                            <div className="text-red-500 text-xs mt-1">{meta.error}</div>
                        )}
                    </>
                )}
            </Field>
        </div>
    )

    const renderTextField = (fieldConfig: IFieldMeta) => (
        <div className="col-span-3">
            <Field name={fieldConfig.name}>
                {({ field, form, meta }: FieldProps) => (
                    <>
                        <label htmlFor={fieldConfig.name} className="block text-sm font-medium text-gray-700">
                            {fieldConfig.label}
                        </label>
                        <Input
                            id={fieldConfig.name}
                            {...formik.getFieldProps(fieldConfig.name)}
                            className={meta.touched && meta.error ? "border-red-500" : ""}
                            placeholder={fieldConfig.placeholder}
                        />
                        {meta.touched && meta.error && (
                            <div className="text-red-500 text-xs mt-1">{meta.error}</div>
                        )}
                    </>
                )}
            </Field>
        </div>
    )

    const renderSelectField = (fieldConfig: IFieldMeta) => (
        <div className="col-span-3">
            <Field name={fieldConfig.name}>
                {({ field, form, meta }: FieldProps) => (
                    <>
                        <label htmlFor={fieldConfig.name} className="block text-sm font-medium text-gray-700">
                            {fieldConfig.label}
                        </label>
                        <Select
                            onValueChange={(value) => form.setFieldValue(fieldConfig.name, value)}
                            defaultValue={field.value}
                            value={field.value}
                        >
                            <SelectTrigger className={`w-full ${meta.touched && meta.error ? "border-red-500" : ""}`}>
                                <SelectValue placeholder={`Select ${fieldConfig.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {fieldConfig.options && fieldConfig.options.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {meta.touched && meta.error && (
                            <div className="text-red-500 text-xs mt-1">{meta.error}</div>
                        )}
                    </>
                )}
            </Field>
        </div>
    )

    const renderNumberField = (fieldConfig: IFieldMeta) => (
        <div className="col-span-3">
            <Field name={fieldConfig.name}>
                {({ field, form, meta }: FieldProps) => (
                    <>
                        <label htmlFor={fieldConfig.name} className="block text-sm font-medium text-gray-700">
                            {fieldConfig.label}
                        </label>
                        <Input
                            id={fieldConfig.name}
                            {...formik.getFieldProps(fieldConfig.name)}
                            className={meta.touched && meta.error ? "border-red-500" : ""}
                            placeholder={fieldConfig.placeholder}
                        />
                        {meta.touched && meta.error && (
                            <div className="text-red-500 text-xs mt-1">{meta.error}</div>
                        )}
                    </>
                )}
            </Field>
        </div>
    )

    useEffect(() => {
        if (editingCustomer) {
            formik.setValues({
                name: editingCustomer.name,
                description: editingCustomer.description,
                status: editingCustomer.status,
                rate: editingCustomer.rate,
                balance: editingCustomer.balance,
                deposit: editingCustomer.deposit,
            })
        } else {
            formik.resetForm()
        }
    }, [editingCustomer, isModalOpen])


    return (
        <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-[500px] bg-white max-h-[85vh] flex flex-col p-0 gap-0">
                <FormikProvider value={formik}>
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle>{editingCustomer ? "Edit Customer" : "Add Customer"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 px-6 overflow-y-auto">
                        {fieldMeta?.map((field) => (
                            <div key={field.name} className="contents">
                                {renderFields(field)}
                            </div>
                        ))}
                    </div>
                    <DialogFooter className="p-6 pt-2">
                        <Button variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit" onClick={() => formik.handleSubmit()} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {editingCustomer ? "Update" : "Add"}
                        </Button>
                    </DialogFooter>
                </FormikProvider>
            </DialogContent>
        </Dialog>
    )
}
