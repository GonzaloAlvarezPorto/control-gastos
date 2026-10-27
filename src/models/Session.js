import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },

        expiresAt:{
            type: Date,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;