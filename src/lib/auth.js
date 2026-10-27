import { cookies } from "next/headers";
import connectDB from "./mongodb";
import Session from "@/models/Session";
import User from "@/models/User";

export async function getSession() {
    const cookieStore = await cookies();

    const token = cookieStore.get("session")?.value;

    if(!token) {
        return null;
    }

    await connectDB();

    const session = await Session.findOne({
        token,
        expiresAt: { $gt: new Date() },

    }).populate("userId");

    return session;
}