
"use client";

import { useEffect, useState } from "react";

export default function useTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await fetch("/api/transactions");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.mensaje || "No se pudieron cargar los movimientos."
                    );
                }

                setTransactions(sortTransactions(data));
            } catch (error) {
                setError(
                    error.message || "No se pudo conectar con el servidor."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchTransactions();
    }, []);

    function sortTransactions(items) {
        return [...items].sort((a, b) => {
            const aHasDate = Boolean(a.transactionDate);
            const bHasDate = Boolean(b.transactionDate);

            // Primero, movimientos sin fecha de movimiento
            if (!aHasDate && bHasDate) return -1;
            if (aHasDate && !bHasDate) return 1;

            // Movimientos sin fecha: vencimiento más reciente primero
            if (!aHasDate && !bHasDate) {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;

                return new Date(b.dueDate) - new Date(a.dueDate);
            }

            // Movimientos con fecha: fecha más reciente primero
            return new Date(b.transactionDate) - new Date(a.transactionDate);
        });
    }

    const accountBalance = transactions.reduce((balance, transaction) => {
        if (!transaction.transactionDate) return balance;
        if (transaction.paymentMethod !== "Electrónico") return balance;

        return transaction.type === "income"
            ? balance + transaction.amount
            : balance - transaction.amount;
    }, 0);

    const formatAmount = (amount) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 2,
        }).format(amount);

    async function saveTransaction(formData, editingId) {
        const isEditing = editingId !== null;

        const response = await fetch(
            isEditing
                ? `/api/transactions/${editingId}`
                : "/api/transactions",
            {
                method: isEditing ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.mensaje ||
                (isEditing
                    ? "No se pudo actualizar el movimiento."
                    : "No se pudo guardar el movimiento.")
            );
        }

        const savedTransaction = data.transaction || data;

        setTransactions((current) => {
            const updatedTransactions = isEditing
                ? current.map((transaction) =>
                    transaction._id === editingId
                        ? savedTransaction
                        : transaction
                )
                : [...current, savedTransaction];

            return sortTransactions(updatedTransactions);
        });

        return savedTransaction;
    }

    async function deleteTransaction(transactionId) {
        const response = await fetch(
            `/api/transactions/${transactionId}`,
            {
                method: "DELETE",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.mensaje || "No se pudo eliminar el movimiento."
            );
        }

        setTransactions((current) =>
            current.filter((transaction) => transaction._id !== transactionId)
        );
    }

    return {
        transactions,
        loading,
        error,
        setError,
        accountBalance,
        formatAmount,
        saveTransaction,
        deleteTransaction,
    };
}
