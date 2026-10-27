import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;

        if (token) {
            await connectDB();

            await Session.deleteOne({ token });

            return Response.json({
                ok: true,
                message: "Sesión cerrada correctamente",
            });
        }
    } catch (error) {
        console.error(error);

        return Response.json(
            { message: "Error al cerrar sesión" },
            { status: 500 }
        )
    }
}