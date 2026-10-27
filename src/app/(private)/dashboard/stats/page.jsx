
"use client";

import { useState } from "react";
import useTransactions from "@/hooks/useTransactions";
import Link from "next/link";

export default function StatsPage() {
    const { transactions, loading, formatAmount } = useTransactions();
    const [type, setType] = useState("income");

    const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
    const [searchDescription, setSearchDescription] = useState("");

    const filteredTransactions = transactions.filter((transaction) => {
        if (!transaction.transactionDate) return false;
        if (transaction.type !== type) return false;

        if (selectedMonth !== "all") {
            const transactionDate = new Date(transaction.transactionDate);

            const month = String(
                transactionDate.getUTCMonth() + 1
            ).padStart(2, "0");

            const year = transactionDate.getUTCFullYear();

            if (`${year}-${month}` !== selectedMonth) return false;
        }

        if (
            selectedCategory !== "all" &&
            transaction.category !== selectedCategory
        ) {
            return false;
        }

        if (
            selectedPaymentMethod !== "all" &&
            transaction.paymentMethod !== selectedPaymentMethod
        ) {
            return false;
        }

        if (
            searchDescription.trim() &&
            !transaction.description
                ?.toLowerCase()
                .includes(searchDescription.trim().toLowerCase())
        ) {
            return false;
        }

        return true;
    });

    const availableMonths = [
        ...new Set(
            transactions
                .filter((transaction) => transaction.transactionDate)
                .map((transaction) => {
                    const date = new Date(transaction.transactionDate);

                    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
                    const year = date.getUTCFullYear();

                    return `${year}-${month}`;
                })
        ),
    ].sort((a, b) => b.localeCompare(a));

    const availableCategories = [
        ...new Set(
            transactions
                .filter((transaction) => transaction.transactionDate)
                .map((transaction) => transaction.category)
                .filter(Boolean)
        ),
    ].sort();

    const availablePaymentMethods = [
        ...new Set(
            transactions
                .filter((transaction) => transaction.transactionDate)
                .map((transaction) => transaction.paymentMethod)
                .filter(Boolean)
        ),
    ].sort();

    const total = filteredTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
    );

    if (loading) {
        return <p>Cargando movimientos...</p>;
    }

    return (
        <div className="d-flex fd-col ai-center g-1rem w-100">
            <h1>Estadísticas</h1>

            <div className="d-flex fd-row g-1rem">
                <button
                    type="button"
                    className="action-btn"
                    onClick={() => setType("income")}
                >
                    Ingresos
                </button>

                <button
                    type="button"
                    className="action-btn"
                    onClick={() => setType("expense")}
                >
                    Egresos
                </button>
            </div>

            <div className="d-flex fd-row w-100 g-1rem jc-between ai-center">
                <label htmlFor="month">Mes:</label>

                <select
                    id="month"
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                >
                    <option value="all">Todos los meses</option>

                    {availableMonths.map((month) => {
                        const [year, number] = month.split("-");

                        const label = new Date(
                            Number(year),
                            Number(number) - 1,
                            1
                        ).toLocaleDateString("es-AR", {
                            month: "long",
                            year: "numeric",
                        });

                        return (
                            <option key={month} value={month}>
                                {label}
                            </option>
                        );
                    })}
                </select>
            </div>

            <div className="d-flex fd-row w-100 g-1rem jc-between ai-center">
                <label htmlFor="description">Descripción:</label>

                <input
                    id="description"
                    type="text"
                    value={searchDescription}
                    onChange={(event) => setSearchDescription(event.target.value)}
                    placeholder="Buscar movimiento..."
                />
            </div>

            <div className="d-flex fd-row w-100 g-1rem jc-between ai-center">
                <label htmlFor="category">Categoría:</label>

                <select
                    id="category"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                >
                    <option value="all">Todas las categorías</option>

                    {availableCategories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="d-flex fd-row w-100 g-1rem jc-between ai-center">
                <label htmlFor="paymentMethod">Medio de pago:</label>

                <select
                    id="paymentMethod"
                    value={selectedPaymentMethod}
                    onChange={(event) =>
                        setSelectedPaymentMethod(event.target.value)
                    }
                >
                    <option value="all">Todos los medios</option>

                    {availablePaymentMethods.map((method) => (
                        <option key={method} value={method}>
                            {method}
                        </option>
                    ))}
                </select>
            </div>

            <p>
                Total de {type === "income" ? "ingresos" : "egresos"}:
            </p>

            <h2>{formatAmount(total)}</h2>

            <Link className="action-btn" href={'/dashboard'}>Volver</Link>
        </div>
    );
}
