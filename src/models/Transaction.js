
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        transactionDate: {
            type: Date,
            default: null,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        accountBalance: {
            type: Number,
            default: null,
        },
        type: {
            type: String,
            enum: ["income", "expense"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            validate: {
                validator: (value) => Number.isFinite(value) && value > 0,
                message: "El importe debe ser mayor que cero",
            },
        },
        dueDate: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
            required: true,
        },
        category: {
            type: String,
            trim: true,
            default: "",
        },
        paymentMethod: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Transaction =
    mongoose.models.Transaction ||
    mongoose.model("Transaction", transactionSchema);

export default Transaction;
