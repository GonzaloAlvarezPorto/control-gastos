
"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.mensaje || "No se pudo iniciar sesión.");
                return;
            }

            window.location.href = "/dashboard";
        } catch {
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="d-flex fd-col g-1rem ai-center">
            <p>Iniciá sesión para continuar.</p>

            <form className="d-flex fd-col g-1rem ai-center" onSubmit={handleSubmit}>
                <div className="d-flex fd-row jc-between w-100 ai-center g-1rem">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="username"
                        required
                    />
                </div>

                <div className="d-flex fd-row jc-between w-100 ai-center g-1rem">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </div>

                {error && <p role="alert">{error}</p>}

                <button className="action-btn" type="submit" disabled={loading}>
                    {loading ? "Ingresando..." : "Iniciar sesión"}
                </button>
            </form>

            <Link className="link-btn" href="/">
                Volver
            </Link>
        </div>
    );
}
