
"use client";

export default function DashboardHeader({ onLogout }) {
    return (
        <div className="d-flex fd-row jc-end">
            <button className="action-btn" type="button" onClick={onLogout}>
                Cerrar sesión
            </button>
        </div>
    );
}
