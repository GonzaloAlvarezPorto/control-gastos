
"use client";

import { useState } from "react";

export default function TransactionList({
    transactions,
    formatAmount,
    onEdit,
    onDelete,
    onRegisterPayment
}) {

    const currentDate = new Date();

    const currentMonth = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [endMonth, setEndMonth] = useState(currentMonth);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const availableMonths = [
        ...new Set([
            currentMonth,
            ...transactions
                .filter((transaction) => transaction.transactionDate)
                .map((transaction) => {
                    const date = new Date(transaction.transactionDate);
                    const year = date.getUTCFullYear();
                    const month = String(date.getUTCMonth() + 1).padStart(2, "0");

                    return `${year}-${month}`;
                }),
        ]),
    ].sort((a, b) => b.localeCompare(a));

    const visibleTransactions = transactions.filter((transaction) => {
        if (!transaction.transactionDate) return true;

        const date = new Date(transaction.transactionDate);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const transactionMonth = `${year}-${month}`;

        if (transactionMonth < selectedMonth) {
            return false;
        }

        if (transactionMonth > endMonth) {
            return false;
        }

        return true;
    });

    if (transactions.length === 0) {
        return (
            <p className="ta-center">
                Todavía no hay movimientos registrados.
            </p>
        );
    }

    return (
        <div className="d-flex fd-col g-1rem">

            <div className="d-flex fd-col g-0_5rem">
                <div className="d-flex fd-row ai-center jc-between g-1rem">
                    <label htmlFor="endMonth">Hasta:</label>

                    <select
                        id="endMonth"
                        value={endMonth}
                        onChange={(event) => setEndMonth(event.target.value)}
                    >

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
                                <option
                                    key={month}
                                    value={month}
                                    disabled={selectedMonth !== "all" && month < selectedMonth}
                                >
                                    {label}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="d-flex fd-row ai-center jc-between g-1rem">
                    <label htmlFor="startMonth">Desde:</label>

                    <select
                        id="startMonth"
                        value={selectedMonth}
                        onChange={(event) => {
                            const month = event.target.value;
                            setSelectedMonth(month);

                            if (
                                month !== "all" &&
                                endMonth !== "all" &&
                                endMonth < month
                            ) {
                                setEndMonth(month);
                            }
                        }}
                    >

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
            </div>

            <div className="d-flex fd-col">
                {visibleTransactions.map((transaction) => (
                    <article
                        className={`d-flex fd-col g-0_5rem p-1rem jc-center mov-list-box ${transaction.status === "pending"
                            ? "bgc-dark-red"
                            : "bgc-green-excel"
                            }`}
                        key={transaction._id}
                    >
                        <div className="d-flex fd-row jc-between ai-center">
                            <p className="w-40 fw-bold">
                                {transaction.transactionDate
                                    ? new Date(
                                        transaction.transactionDate
                                    ).toLocaleDateString("es-AR", {
                                        timeZone: "UTC",
                                    })
                                    : "Sin fecha"}
                            </p>

                            <div className="d-flex fd-row g-1rem">
                                <button
                                    type="button"
                                    onClick={() => onEdit(transaction)}
                                    aria-label="Editar movimiento"
                                    className="edit-btn"
                                    title="Editar"
                                >
                                    🖊
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(transaction)}
                                    aria-label="Eliminar movimiento"
                                    className="delete-btn"
                                    title="Eliminar"
                                >
                                    🗑
                                </button>
                            </div>
                        </div>

                        <div className="d-flex fd-row fw-wr g-0_5rem jc-between ai-center">
                            <p>{transaction.description}</p>

                            {transaction.type === "income" ? (
                                <p className="fc-green-logo fw-bold">
                                    {formatAmount(transaction.amount)}
                                </p>
                            ) : (
                                <p className="fc-red fw-bold">
                                    -{formatAmount(transaction.amount)}
                                </p>
                            )}

                            <p>{transaction.category}</p>
                        </div>

                        <div className="d-flex fd-col g-0_5rem jc-center">
                            {transaction.dueDate && (
                                <p>
                                    <strong>Vencimiento: </strong>
                                    {new Date(
                                        transaction.dueDate
                                    ).toLocaleDateString("es-AR", {
                                        timeZone: "UTC",
                                    })}
                                </p>
                            )}

                            <p>
                                <strong>Modo:</strong> {transaction.paymentMethod}
                            </p>
                        </div>

                        {!transaction.transactionDate && transaction.dueDate && (
                            <button
                                type="button"
                                className="action-btn"
                                onClick={() => onRegisterPayment(transaction)}
                            >
                                Registrar pago
                            </button>
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
}
