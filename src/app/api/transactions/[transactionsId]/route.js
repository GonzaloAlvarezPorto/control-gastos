
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Transaction from "@/models/Transaction";
import { recalculateAccountBalances } from "@/lib/transactions";


export async function PATCH(request, { params }) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { mensaje: "No autorizado" },
                { status: 401 }
            );
        }

        const { transactionsId } = await params;

        if (!mongoose.isValidObjectId(transactionsId)) {
            return NextResponse.json(
                { mensaje: "ID de movimiento inválido" },
                { status: 400 }
            );
        }

        const body = await request.json();

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return NextResponse.json(
                { mensaje: "Los datos del movimiento no son válidos" },
                { status: 400 }
            );
        }

        const has = (field) =>
            Object.prototype.hasOwnProperty.call(body, field);

        const isValidDate = (value) =>
            value === null ||
            (
                typeof value === "string" &&
                value.trim() !== "" &&
                !Number.isNaN(Date.parse(value))
            );

        if (
            (has("transactionDate") && !isValidDate(body.transactionDate)) ||
            (has("dueDate") && !isValidDate(body.dueDate))
        ) {
            return NextResponse.json(
                { mensaje: "Las fechas del movimiento no son válidas" },
                { status: 400 }
            );
        }

        if (
            has("description") &&
            (typeof body.description !== "string" ||
                !body.description.trim())
        ) {
            return NextResponse.json(
                { mensaje: "La descripción es obligatoria" },
                { status: 400 }
            );
        }

        if (
            has("type") &&
            !["income", "expense"].includes(body.type)
        ) {
            return NextResponse.json(
                { mensaje: "El tipo de movimiento no es válido" },
                { status: 400 }
            );
        }

        if (
            has("amount") &&
            (
                typeof body.amount !== "number" ||
                !Number.isFinite(body.amount) ||
                body.amount <= 0
            )
        ) {
            return NextResponse.json(
                { mensaje: "El importe debe ser mayor que cero" },
                { status: 400 }
            );
        }

        if (
            has("paymentMethod") &&
            (
                typeof body.paymentMethod !== "string" ||
                !body.paymentMethod.trim()
            )
        ) {
            return NextResponse.json(
                { mensaje: "El medio de pago es obligatorio" },
                { status: 400 }
            );
        }

        if (
            has("category") &&
            typeof body.category !== "string"
        ) {
            return NextResponse.json(
                { mensaje: "La categoría no es válida" },
                { status: 400 }
            );
        }

        await connectDB();

        const transaction = await Transaction.findOne({
            _id: transactionsId,
            userId: session.userId._id,
        });

        if (!transaction) {
            return NextResponse.json(
                { mensaje: "Movimiento no encontrado" },
                { status: 404 }
            );
        }

        if (has("transactionDate")) {
            transaction.transactionDate = body.transactionDate;
        }

        if (has("description")) {
            transaction.description = body.description.trim();
        }

        if (has("type")) {
            transaction.type = body.type;
        }

        if (has("amount")) {
            transaction.amount = body.amount;
        }

        if (has("dueDate")) {
            transaction.dueDate = body.dueDate;
        }

        if (has("category")) {
            transaction.category = body.category.trim();
        }

        if (has("paymentMethod")) {
            transaction.paymentMethod = body.paymentMethod.trim();
        }

        transaction.status = transaction.transactionDate
            ? "completed"
            : "pending";

        await transaction.save();

        await recalculateAccountBalances(session.userId._id);

        const updatedTransaction = await Transaction.findOne({
            _id: transactionsId,
            userId: session.userId._id,
        });

        return NextResponse.json({
            mensaje: "Movimiento actualizado correctamente",
            transaction: updatedTransaction,
        });
    } catch (error) {
        console.error("Error al actualizar movimiento:", error);

        return NextResponse.json(
            { mensaje: "Error al actualizar el movimiento" },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { mensaje: "No autorizado" },
                { status: 401 }
            );
        }

        const { transactionsId } = await params;

        if (!mongoose.isValidObjectId(transactionsId)) {
            return NextResponse.json(
                { mensaje: "ID de movimiento inválido" },
                { status: 400 }
            );
        }

        await connectDB();

        const transaction = await Transaction.findOne({
            _id: transactionsId,
            userId: session.userId._id,
        });

        if (!transaction) {
            return NextResponse.json(
                { mensaje: "Movimiento no encontrado" },
                { status: 404 }
            );
        }

        await Transaction.deleteOne({
            _id: transactionsId,
            userId: session.userId._id,
        });

        await recalculateAccountBalances(session.userId._id);

        return NextResponse.json({
            mensaje: "Movimiento eliminado correctamente",
        });

    } catch (error) {
        console.error("Error al eliminar movimiento:", error);

        return NextResponse.json(
            { mensaje: "Error al eliminar el movimiento" },
            { status: 500 }
        );
    }
}