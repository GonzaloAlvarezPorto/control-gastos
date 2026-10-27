
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Transaction from "@/models/Transaction";
import { recalculateAccountBalances } from "@/lib/transactions";


export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { mensaje: "No autorizado" },
                { status: 401 }
            );
        }

        await connectDB();

        const transactions = await Transaction.find({
            userId: session.userId._id,
        }).sort({
            transactionDate: 1,
            createdAt: 1,
        });

        const sortedTransactions = transactions.sort((a, b) => {
            if (!a.transactionDate && !b.transactionDate) return 0;
            if (!a.transactionDate) return 1;
            if (!b.transactionDate) return -1;
            return new Date(a.transactionDate) - new Date(b.transactionDate);
        });

        return NextResponse.json(sortedTransactions);
    } catch (error) {
        console.error("Error al consultar movimientos:", error);

        return NextResponse.json(
            { mensaje: "Error al consultar movimientos" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { mensaje: "No autorizado" },
                { status: 401 }
            );
        }

        const body = await request.json();

        const {
            transactionDate,
            description,
            type,
            amount,
            dueDate,
            category,
            paymentMethod,
        } = body;

        const isValidDate = (value) =>
            value === null ||
            value === undefined ||
            (
                typeof value === "string" &&
                !Number.isNaN(Date.parse(value))
            );

        if (
            !isValidDate(transactionDate) ||
            !isValidDate(dueDate)
        ) {
            return NextResponse.json(
                { mensaje: "Las fechas del movimiento no son válidas" },
                { status: 400 }
            );
        }

        if (
            !description?.trim() ||
            !["income", "expense"].includes(type) ||
            typeof amount !== "number" ||
            !Number.isFinite(amount) ||
            amount <= 0 ||
            !paymentMethod?.trim()
        ) {
            return NextResponse.json(
                { mensaje: "Los datos del movimiento no son válidos" },
                { status: 400 }
            );
        }

        await connectDB();

        const transaction = await Transaction.create({
            transactionDate: transactionDate || null,
            description,
            type,
            amount,
            dueDate: dueDate || null,
            status: transactionDate ? "completed" : "pending",
            category: category || "",
            paymentMethod,
            userId: session.userId._id,
        });


        await recalculateAccountBalances(session.userId._id);

        const updatedTransaction = await Transaction.findById(transaction._id);

        return NextResponse.json(
            {
                mensaje: "Movimiento guardado correctamente",
                transaction: updatedTransaction,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error al crear el movimiento:", error);

        return NextResponse.json(
            { mensaje: "Error al guardar el movimiento" },
            { status: 500 }
        );
    }
}
