import { useCreateCustomer, useUpdateCustomer } from "@/hooks/useCustomers"
import type { IFieldMeta, PaymentStatus } from "@/types/customer"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { Spinner } from "../ui/spinner"
import { Textarea } from "../ui/textarea"
import { customerInitialValues, fieldMeta, validationSchema } from "./helper"

export function CustomerModal() {
    const { isModalOpen, closeModal, editingCustomer, isViewMode } = useStore()
    const { mutateAsync: createCustomer, isPending: isCreating } = useCreateCustomer()
    const { mutateAsync: updateCustomer, isPending: isUpdating } = useUpdateCustomer()

    const isLoading = isCreating || isUpdating

    const formik = useFormik({
        initialValues: customerInitialValues,
        validationSchema,
        onSubmit: async (values) => {
            const customerData = {
                ...values,
                rate: Number(values.rate),
                balance: Number(values.balance),
                deposit: Number(values.deposit),
                status: values.status as PaymentStatus,
            }

            if (editingCustomer) {
                await updateCustomer({ ...customerData, id: editingCustomer.id })
            } else {
                await createCustomer(customerData)
            }
            closeModal()
        },
    })

    
    const renderLabel = (name: string, label: string) => (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
        </label>
    )

    const renderError = (touched: boolean | undefined, error: string | undefined) => 
        touched && error ? <div className="text-red-500 text-xs mt-1.5 font-medium">{error}</div> : null

    const renderTextAreaField = (fieldConfig: IFieldMeta) => (
        <div className="w-full">
            <Field name={fieldConfig.name}>
                {({ meta }: FieldProps) => (
                    <>
                        {renderLabel(fieldConfig.name, fieldConfig.label)}
                        <Textarea
                            id={fieldConfig.name}
                            {...formik.getFieldProps(fieldConfig.name)}
                            disabled={isViewMode}
                            className={`resize-none min-h-[80px] ${meta.touched && meta.error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            placeholder={fieldConfig.placeholder}
                        />
                        {renderError(meta.touched, meta.error)}
                    </>
                )}
            </Field>
        </div>
    )

    const renderTextField = (fieldConfig: IFieldMeta) => (
        <div className="w-full">
            <Field name={fieldConfig.name}>
                {({ meta }: FieldProps) => (
                    <>
                        {renderLabel(fieldConfig.name, fieldConfig.label)}
                        <Input
                            id={fieldConfig.name}
                            {...formik.getFieldProps(fieldConfig.name)}
                            disabled={isViewMode}
                            className={meta.touched && meta.error ? "border-red-500 focus-visible:ring-red-500" : ""}
                            placeholder={fieldConfig.placeholder}
                        />
                        {renderError(meta.touched, meta.error)}
                    </>
                )}
            </Field>
        </div>
    )

    const renderSelectField = (fieldConfig: IFieldMeta) => (
        <div className="w-full">
            <Field name={fieldConfig.name}>
                {({ field, form, meta }: FieldProps) => (
                    <>
                        {renderLabel(fieldConfig.name, fieldConfig.label)}
                        <Select
                            onValueChange={(value) => form.setFieldValue(fieldConfig.name, value)}
                            defaultValue={field.value}
                            value={field.value}
                            disabled={isViewMode}
                        >
                            <SelectTrigger className={`w-full ${meta.touched && meta.error ? "border-red-500 focus:ring-red-500" : ""}`}>
                                <SelectValue placeholder={`Select ${fieldConfig.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {fieldConfig.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {renderError(meta.touched, meta.error)}
                    </>
                )}
            </Field>
        </div>
    )

    const renderNumberField = (fieldConfig: IFieldMeta) => (
        <div className="w-full">
            <Field name={fieldConfig.name}>
                {({ meta }: FieldProps) => (
                    <>
                        {renderLabel(fieldConfig.name, fieldConfig.label)}
                        <Input
                            id={fieldConfig.name}
                            type="number"
                            {...formik.getFieldProps(fieldConfig.name)}
                            disabled={isViewMode}
                            className={meta.touched && meta.error ? "border-red-500 focus-visible:ring-red-500" : ""}
                            placeholder={fieldConfig.placeholder}
                        />
                        {renderError(meta.touched, meta.error)}
                    </>
                )}
            </Field>
        </div>
    )

    const renderFields = (fieldConfig: IFieldMeta) => {
        switch (fieldConfig.type) {
            case "textField": return renderTextField(fieldConfig)
            case "selectField": return renderSelectField(fieldConfig)
            case "numberField": return renderNumberField(fieldConfig)
            case "textAreaField": return renderTextAreaField(fieldConfig)
            default: return null
        }
    }

    useEffect(() => {
        if (editingCustomer) {
            formik.setValues({
                ...customerInitialValues,
                ...editingCustomer,
                rate: String(editingCustomer.rate),
                balance: String(editingCustomer.balance),
                deposit: String(editingCustomer.deposit),
                status: editingCustomer.status,
            })
        } else {
            formik.resetForm()
        }
    }, [editingCustomer, isModalOpen])

    return (
        <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <FormikProvider value={formik}>
                    
                    {/* Header: Static at top */}
                    <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                        <DialogTitle className="text-xl">
                            {isViewMode 
                                ? "View Customer" 
                                : editingCustomer 
                                    ? "Edit Customer" 
                                    : "Add Customer"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="flex flex-col gap-5">
                            {fieldMeta?.map((field) => (
                                <div key={field.name}>
                                    {renderFields(field)}
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50">
                        {isViewMode ? (
                            <Button 
                                variant="outline" 
                                onClick={closeModal} 
                                className="w-full sm:w-auto"
                            >
                                Close
                            </Button>
                        ) : (
                            <>
                                <Button 
                                    variant="outline" 
                                    onClick={closeModal} 
                                    disabled={isLoading}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={formik.submitForm}
                                    disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                                >
                                    {isLoading && <Spinner className="mr-2 h-4 w-4 text-white" />}
                                    {editingCustomer ? "Save Changes" : "Create Customer"}
                                </Button>
                            </>
                        )}
                    </DialogFooter>

                </FormikProvider>
            </DialogContent>
        </Dialog>
    )
}