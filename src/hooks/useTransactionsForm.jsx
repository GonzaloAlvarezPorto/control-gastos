
"use client";

import { useState } from "react";

const INITIAL_FORM_DATA = {
    description: "",
    type: "expense",
    amount: "",
    transactionDate: "",
    dueDate: "",
    category: "Comida",
    paymentMethod: "Electrónico",
    customPaymentMethod: "",
    customDescription: "",
};

const STANDARD_PAYMENT_METHODS = [
    "Electrónico",
    "Efectivo",
    "Otros",
];

export default function useTransactionForm({
    saveTransaction,
    setError,
}) {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    function openNewForm() {
        setEditingId(null);
        setFormData({ ...INITIAL_FORM_DATA });
        setFormError("");
        setError("");
        setShowForm(true);
    }

    function handleEdit(transaction) {
        const isStandardPaymentMethod =
            STANDARD_PAYMENT_METHODS.includes(transaction.paymentMethod);

        setEditingId(transaction._id);

        setFormData({
            description: transaction.description || "",
            type: transaction.type || "expense",
            amount: String(transaction.amount ?? ""),
            transactionDate: transaction.transactionDate
                ? new Date(transaction.transactionDate)
                    .toISOString()
                    .slice(0, 10)
                : "",
            dueDate: transaction.dueDate
                ? new Date(transaction.dueDate)
                    .toISOString()
                    .slice(0, 10)
                : "",
            category: transaction.category || "Comida",
            paymentMethod: isStandardPaymentMethod
                ? transaction.paymentMethod
                : "Otros",
            customPaymentMethod: isStandardPaymentMethod
                ? ""
                : transaction.paymentMethod || "",
            customDescription: "",
        });

        setFormError("");
        setError("");
        setShowForm(true);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setFormError("");
        setError("");

        try {
            const paymentMethod =
                formData.paymentMethod === "Otros"
                    ? formData.customPaymentMethod.trim()
                    : formData.paymentMethod;

            const description =
                formData.description === "Otro"
                    ? formData.customDescription.trim()
                    : formData.description.trim();

            if (!description) {
                throw new Error("Ingresá una descripción.");
            }

            if (!formData.amount || Number(formData.amount) <= 0) {
                throw new Error("Ingresá un importe mayor que cero.");
            }

            if (!paymentMethod) {
                throw new Error("Indicá el medio de pago.");
            }

            const payload = {
                description,
                type: formData.type,
                amount: Number(formData.amount),
                transactionDate: formData.transactionDate || null,
                dueDate: formData.dueDate || null,
                category: formData.category,
                paymentMethod,
            };

            await saveTransaction(payload, editingId);

            setFormData({ ...INITIAL_FORM_DATA });
            setEditingId(null);
            setShowForm(false);
        } catch (error) {
            setFormError(
                error.message || "No se pudo guardar el movimiento."
            );
        } finally {
            setSaving(false);
        }
    }

    function handleCancelForm() {
        setShowForm(false);
        setEditingId(null);
        setFormData({ ...INITIAL_FORM_DATA });
        setFormError("");
    }

    return {
        showForm,
        editingId,
        saving,
        formError,
        formData,
        setFormData,
        openNewForm,
        handleEdit,
        handleSubmit,
        handleCancelForm,
    };
}
