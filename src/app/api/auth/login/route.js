import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        await connectDB();

        const user = await User.findOne({ email });

        if (!user) {
            return Response.json(
                { message: "Credenciales incorrectas - email" },
                { status: 401 }
            )
        }

        const correctPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!correctPassword) {
            return Response.json(
                { message: "Credenciales incorrectas - password" },
                { status: 401 }
            )
        }

        const token = crypto.randomBytes(32).toString("hex");

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await Session.create({
            token,
            userId: user._id,
            expiresAt,
        })

        const cookieStore = await cookies();

        cookieStore.set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: expiresAt,
            path: "/"
        });

        return Response.json({
            ok: true,
            message: "Login correcto",
        });

    } catch (error) {
        console.error(error);

        return Response.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        )
    }
}