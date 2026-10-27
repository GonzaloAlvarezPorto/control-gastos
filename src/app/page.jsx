import { getSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function Home() {
    const session = await getSession();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="d-flex fd-col g-1rem ai-center">
            <p className="ta-center">Administrá tus gastos de forma simple.</p>

            <Link className="link-btn" href="/login">
                Iniciar sesión
            </Link>
        </div>
    );
}