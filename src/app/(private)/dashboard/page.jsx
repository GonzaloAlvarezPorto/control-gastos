
"use client";

import { useRouter } from "next/navigation";
import AccountBalance from "@/components/dashboard/AccountBalance";
import TransactionForm from "@/components/dashboard/TransactionForm";
import TransactionList from "@/components/dashboard/TransactionList";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import useTransactions from "@/hooks/useTransactions";
import useTransactionForm from "@/hooks/useTransactionsForm";
import { useEffect, useRef, useState } from "react";
import DueToday from "@/components/dashboard/DueToday";
import Link from "next/link";

export default function DashboardPage() {
    const router = useRouter();

    const formRef = useRef(null);

    const [showDueToday, setShowDueToday] = useState(false);

    const {
        transactions,
        loading,
        error,
        setError,
        accountBalance,
        formatAmount,
        saveTransaction,
        deleteTransaction,
    } = useTransactions();

    const {
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
    } = useTransactionForm({
        saveTransaction,
        setError,
    });

    const descriptions = [
        ...new Set(
            transactions
                .map((transaction) => transaction.description?.trim())
                .filter(Boolean)
        ),
    ].sort((a, b) => a.localeCompare(b, "es"));

    useEffect(() => {
        if (showForm && editingId) {
            formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [showForm, editingId]);

    async function handleDelete(transaction) {
        const confirmed = window.confirm(
            `¿Querés eliminar el movimiento "${transaction.description}"?`
        );

        if (!confirmed) return;

        setError("");

        try {
            await deleteTransaction(transaction._id);
        } catch (error) {
            setError(
                error.message || "No se pudo eliminar el movimiento."
            );
        }
    }

    async function handleLogout() {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("No se pudo cerrar la sesión.");
            }

            router.push("/");
            router.refresh();
        } catch (error) {
            setError(error.message || "No se pudo cerrar la sesión.");
        }
    }

    async function handleRegisterPayment(transaction) {
        if (!transaction.dueDate) return;

        try {
            await saveTransaction(
                {
                    ...transaction,
                    transactionDate: transaction.dueDate,
                },
                transaction._id
            );
        } catch (error) {
            console.error("Error al registrar el pago:", error);
        }
    }

    if (loading) {
        return <main><p>Cargando movimientos...</p></main>;
    }

    return (
        <div className="d-flex fd-col g-1rem ai-center w-100">
            <DashboardHeader onLogout={handleLogout} />

            {error && (
                <p role="alert">
                    {error}
                </p>
            )}

            <AccountBalance
                accountBalance={accountBalance}
                formatAmount={formatAmount}
            />

            <section className="d-flex fd-col g-1rem w-100">
                <div className="d-flex fd-row w-100 jc-center ai-center">
                    {!showForm && (
                        <div className="d-flex fw-wr fd-row g-1rem ai-center">
                            <button className="action-btn" type="button" onClick={openNewForm}>
                                Nuevo movimiento
                            </button>
                            <button
                                className="action-btn"
                                type="button"
                                onClick={() => setShowDueToday(true)}
                                title="¿Qué vence hoy?"
                            >
                                📅
                            </button>
                            <Link className="action-btn" title="Estadísticas" href={'/dashboard/stats'}>📊</Link>
                        </div>
                    )}
                </div>

                {showForm && (
                    <div ref={formRef}>
                        <TransactionForm
                            formData={formData}
                            setFormData={setFormData}
                            editingId={editingId}
                            saving={saving}
                            formError={formError}
                            onSubmit={handleSubmit}
                            onCancel={handleCancelForm}
                            descriptions={descriptions}
                        />
                    </div>
                )}
                <TransactionList
                    transactions={transactions}
                    formatAmount={formatAmount}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRegisterPayment={handleRegisterPayment}
                />
            </section>
            <DueToday
                showDueToday={showDueToday}
                setShowDueToday={setShowDueToday}
            />
        </div>
    );
}
