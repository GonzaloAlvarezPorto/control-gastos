
"use client";

import { useEffect, useRef, useState } from "react";

export default function TransactionForm({
    formData,
    setFormData,
    editingId,
    saving,
    formError,
    onSubmit,
    onCancel,
    descriptions,
}) {

    const formRef = useRef(null);

    const currentYear = new Date().getFullYear();

    const [selectedYear, setSelectedYear] = useState(
        formData.transactionDate
            ? Number(formData.transactionDate.slice(0, 4))
            : 2026
    );

    const [dueYear, setDueYear] = useState(
        formData.dueDate
            ? Number(formData.dueDate.slice(0, 4))
            : 2026
    );

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    useEffect(() => {
        function handleKeyDown(event) {
            if (
                event.altKey &&
                event.key.toLowerCase() === "g" &&
                !event.repeat &&
                !saving
            ) {
                event.preventDefault();

                formRef.current?.requestSubmit();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [saving]);

    return (
        <form
            ref={formRef}
            className="d-flex fd-col g-0_5rem"
            onSubmit={onSubmit}
        >
            <p className="fw-bold fc-green-logo td-under">
                {editingId ? "EDITAR MOVIMIENTO" : "NUEVO MOVIMIENTO"}
            </p>

            {formError && <p role="alert">{formError}</p>}

            <div className="d-flex fd-row w-100 jc-between ai-center">
                <label htmlFor="description">Descripción</label>
                <select
                    id="description"
                    name="description"
                    value={
                        formData.description === ""
                            ? ""
                            : formData.description === "Otro" ||
                                !descriptions.includes(formData.description)
                                ? "Otro"
                                : formData.description
                    }
                    onChange={(event) => {
                        const value = event.target.value;

                        setFormData((current) => ({
                            ...current,
                            description: value === "Otro" ? "Otro" : value,
                            customDescription: "",
                        }));
                    }}
                    required
                >
                    <option value="">Seleccionar descripción</option>

                    {descriptions.map((description) => (
                        <option key={description} value={description}>
                            {description}
                        </option>
                    ))}

                    <option value="Otro">Otro</option>
                </select>
            </div>

            {(
                formData.description === "Otro" ||
                !descriptions.includes(formData.description)
            ) && (
                    <div className="d-flex fd-row w-100 jc-between ai-center">
                        <label htmlFor="customDescription">
                            Nueva descripción
                        </label>
                        <input
                            id="customDescription"
                            name="customDescription"
                            type="text"
                            value={formData.customDescription || ""}
                            onChange={(event) =>
                                setFormData((current) => ({
                                    ...current,
                                    customDescription: event.target.value,
                                }))
                            }
                            required
                        />
                    </div>
                )}

            <div className="d-flex fd-row w-100 jc-between ai-center">
                <label htmlFor="type">Tipo</label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                >
                    <option value="income">Ingreso</option>
                    <option value="expense">Egreso</option>
                </select>
            </div>

            <div className="d-flex fd-row w-100 jc-between ai-center">
                <label htmlFor="amount">Importe</label>
                <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />
            </div>


            <div className="d-flex fd-row w-100 jc-between ai-center">
                <label htmlFor="transactionDay">Fecha del movimiento</label>

                <div className="d-flex fd-row g-0_5rem flex-1">
                    <select
                        aria-label="Día"
                        className="w-35px"
                        id="transactionDay"
                        value={
                            formData.transactionDate
                                ? Number(formData.transactionDate.slice(8, 10))
                                : ""
                        }
                        onChange={(event) => {
                            const day = event.target.value;
                            const [, month = "01"] =
                                formData.transactionDate.split("-");

                            setFormData((current) => ({
                                ...current,
                                transactionDate: day
                                    ? `${selectedYear}-${month}-${day.padStart(2, "0")}`
                                    : "",
                                }));
                            }}
                            
                    >
                        <option value="">D</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>

                    <select
                        aria-label="Mes"
                        className="w-35px"
                        id="transactionMonth"
                        value={
                            formData.transactionDate
                                ? Number(formData.transactionDate.slice(5, 7))
                                : ""
                        }
                        onChange={(event) => {
                            const month = event.target.value;
                            const day = formData.transactionDate
                                ? formData.transactionDate.slice(8, 10)
                                : "";

                            setFormData((current) => ({
                                ...current,
                                transactionDate: day && month
                                    ? `${selectedYear}-${month.padStart(2, "0")}-${day}`
                                    : "",
                            }));
                        }}
                    >
                        <option value="">M</option>

                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>

                    <select
                        aria-label="Año"
                        id="transactionYear"
                        value={selectedYear}
                        onChange={(event) => {
                            const year = Number(event.target.value);
                            setSelectedYear(year);

                            if (formData.transactionDate) {
                                const [, month, day] =
                                    formData.transactionDate.split("-");

                                setFormData((current) => ({
                                    ...current,
                                    transactionDate: `${year}-${month}-${day}`,
                                }));
                            }
                        }}
                    >
                        {Array.from({ length: 11 }, (_, i) => 2026 - 5 + i).map(
                            (year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            )
                        )}
                    </select>
                </div>
            </div>


            <div className="d-flex fd-row w-100 jc-between ai-center">
                <label htmlFor="dueDay">Vencimiento</label>

                <div className="d-flex fd-row g-0_5rem flex-1">
                    <select
                        aria-label="Día de vencimiento"
                        className="w-35px"
                        id="dueDay"
                        value={formData.dueDate ? Number(formData.dueDate.slice(8, 10)) : ""}
                        onChange={(event) => {
                            const day = event.target.value;
                            const [, month = "01"] = (formData.dueDate || "").split("-");

                            setFormData((current) => ({
                                ...current,
                                dueDate: day
                                    ? `${dueYear}-${month}-${day.padStart(2, "0")}`
                                    : "",
                            }));
                        }}
                    >
                        <option value="">D</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>

                    <select
                        aria-label="Mes de vencimiento"
                        id="dueMonth"
                        className="w-35px" 
                        value={formData.dueDate ? Number(formData.dueDate.slice(5, 7)) : ""}
                        onChange={(event) => {
                            const month = event.target.value;
                            const day = formData.dueDate?.slice(8, 10);

                            setFormData((current) => ({
                                ...current,
                                dueDate: day && month
                                    ? `${dueYear}-${month.padStart(2, "0")}-${day}`
                                    : "",
                            }));
                        }}
                    >
                        <option value="">M</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>

                    <select
                        aria-label="Año de vencimiento"
                        id="dueYear"
                        value={dueYear}
                        onChange={(event) => {
                            const year = Number(event.target.value);
                            setDueYear(year);

                            if (formData.dueDate) {
                                const [, month, day] = formData.dueDate.split("-");

                                setFormData((current) => ({
                                    ...current,
                                    dueDate: `${year}-${month}-${day}`,
                                }));
                            }
                        }}
                    >
                        {Array.from({ length: 11 }, (_, i) => 2026 - 5 + i).map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="d-flex fd-row w-100 jc-between ai-center">
                <label htmlFor="category">Categoría</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="Comida">Comida</option>
                    <option value="Finanzas">Finanzas</option>
                    <option value="Impuestos">Impuestos</option>
                    <option value="Otros gastos">Otros gastos</option>
                    <option value="Vacaciones">Vacaciones</option>
                </select>
            </div>

            <div className="d-flex fd-row w-100 jc-between ai-center">
                <label htmlFor="paymentMethod">Medio de pago</label>
                <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                >
                    <option value="Electrónico">Electrónico</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Otros">Otros</option>
                </select>
            </div>

            {formData.paymentMethod === "Otros" && (
                <div className="d-flex fd-row w-100 jc-between ai-center">
                    <label htmlFor="customPaymentMethod">
                        Especificá el medio de pago
                    </label>
                    <input
                        id="customPaymentMethod"
                        name="customPaymentMethod"
                        type="text"
                        value={formData.customPaymentMethod}
                        onChange={handleChange}
                        required
                    />
                </div>
            )}

            <div className="d-flex fd-row w-100 jc-center g-1rem ai-center">
                <button className="action-btn" type="submit" disabled={saving}>
                    {saving
                        ? "Guardando..."
                        : editingId
                            ? "Guardar cambios"
                            : "Guardar movimiento"}
                </button>

                <button className="cancel-btn"
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}
