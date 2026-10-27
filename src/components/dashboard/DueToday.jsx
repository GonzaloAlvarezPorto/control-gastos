import useTransactions from '@/hooks/useTransactions';
import React from 'react'

const DueToday = ({ showDueToday, setShowDueToday }) => {

    const {
            transactions,
            accountBalance,
            formatAmount,
        } = useTransactions();

    const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Argentina/Buenos_Aires",
    });

    const dueToday = transactions.filter((transaction) => {
        if (!transaction.dueDate || transaction.status !== "pending") {
            return false;
        }

        const dueDate = new Date(transaction.dueDate)
            .toISOString()
            .slice(0, 10);

        return dueDate === today;
    });

    const totalDueToday = dueToday.reduce(
        (total, transaction) => total + transaction.amount,
        0
    );

    const balanceAfterPayments = accountBalance - totalDueToday;

    return (
        <>
            {showDueToday && (
                <div className="modal-overlay">
                    <section
                        className="modal-content d-flex fd-col g-1rem"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="due-today-title"
                    >
                        <div className="d-flex fd-row jc-between ai-center">
                            <h2 className="w-50" id="due-today-title">Vencimientos de hoy</h2>

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setShowDueToday(false)}
                                aria-label="Cerrar ventana"
                            >
                                ✕
                            </button>
                        </div>

                        <p>
                            <strong>Fecha:</strong>{" "}
                            {new Date().toLocaleDateString("es-AR", {
                                timeZone: "America/Argentina/Buenos_Aires",
                            })}
                        </p>

                        {dueToday.length === 0 ? (
                            <p>No tenés pagos pendientes que venzan hoy.</p>
                        ) : (
                            <>
                                <div className="d-flex fd-col g-0_5rem">
                                    {dueToday.map((transaction) => (
                                        <div
                                            key={transaction._id}
                                            className="d-flex fd-row jc-between ai-center g-1rem"
                                        >
                                            <p>{transaction.description}</p>
                                            <p className="fw-bold">
                                                {formatAmount(transaction.amount)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <hr />

                                <div className="d-flex fd-row jc-between ai-center">
                                    <p>Total a pagar</p>
                                    <p className="fw-bold">
                                        {formatAmount(totalDueToday)}
                                    </p>
                                </div>

                                <div className="d-flex fd-row jc-between ai-center">
                                    <p>Saldo actual</p>
                                    <p>{formatAmount(accountBalance)}</p>
                                </div>

                                <div className="d-flex fd-row jc-between ai-center">
                                    <p className="w-60 fw-bold">Saldo después de pagar</p>
                                    <p
                                        className={
                                            balanceAfterPayments >= 0
                                                ? "fc-green-logo fw-bold"
                                                : "fc-red fw-bold"
                                        }
                                    >
                                        {formatAmount(balanceAfterPayments)}
                                    </p>
                                </div>

                                <p>
                                    {balanceAfterPayments >= 0
                                        ? "El saldo alcanza para cubrir los vencimientos de hoy."
                                        : "El saldo no alcanza para cubrir todos los vencimientos de hoy."}
                                </p>
                            </>
                        )}

                        <button
                            type="button"
                            className="action-btn"
                            onClick={() => setShowDueToday(false)}
                        >
                            Cerrar
                        </button>
                    </section>
                </div>
            )}
        </>
    )
}

export default DueToday