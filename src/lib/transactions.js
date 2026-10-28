
import Transaction from "@/models/Transaction";

export async function recalculateAccountBalances(userId) {
    const transactions = await Transaction.find({ userId })
        .sort({ createdAt: 1 })
        .lean();

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
    const operations = [];

    for (const transaction of transactions) {
        let status;

        if (!transaction.transactionDate) {
            status = "pending";
        } else {
            status = "completed";

            // Solo los movimientos electrónicos modifican el saldo.
            if (transaction.paymentMethod === "Electrónico") {
                if (transaction.type === "income") {
                    balance += transaction.amount;
                } else {
                    balance -= transaction.amount;
                }
            }
        }

        operations.push({
            updateOne: {
                filter: {
                    _id: transaction._id,
                    userId,
                },
                update: {
                    $set: {
                        status,
                        accountBalance: balance,
                    },
                },
            },
        });
    }

    if (operations.length > 0) {
        await Transaction.bulkWrite(operations);
    }

    return balance;
}
