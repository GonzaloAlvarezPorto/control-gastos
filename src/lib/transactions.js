
import Transaction from "@/models/Transaction";

export async function recalculateAccountBalances(userId) {
    const transactions = await Transaction.find({ userId }).sort({
        createdAt: 1,
    });

    // Los movimientos con fecha van primero, ordenados cronológicamente.
    // Los que no tienen fecha quedan al final.
    transactions.sort((a, b) => {
        if (!a.transactionDate && !b.transactionDate) {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }

        if (!a.transactionDate) return 1;
        if (!b.transactionDate) return -1;

        const dateDifference =
            new Date(a.transactionDate) - new Date(b.transactionDate);

        if (dateDifference !== 0) return dateDifference;

        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    let balance = 0;

    for (const transaction of transactions) {
        if (!transaction.transactionDate) {
            transaction.status = "pending";
            transaction.accountBalance = balance;
        } else {
            transaction.status = "completed";

            if (transaction.paymentMethod === "Electrónico") {
                if (transaction.type === "income") {
                    balance += transaction.amount;
                } else {
                    balance -= transaction.amount;
                }
            }

            // Los movimientos de efectivo u otros medios
            // conservan el saldo bancario sin modificarlo.
            transaction.accountBalance = balance;
        }

        await transaction.save();
    }

    return balance;
}
