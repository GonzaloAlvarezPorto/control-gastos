
"use client";

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
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    return (
        <form className="d-flex fd-col g-0_5rem" onSubmit={onSubmit}>
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
                <label htmlFor="transactionDate">
                    Fecha del movimiento
                </label>
                <input
                    id="transactionDate"
                    name="transactionDate"
                    type="date"
                    value={formData.transactionDate}
                    onChange={handleChange}
                />
            </div>

            <div className="d-flex fd-row w-100 jc-between ai-center">
                <label htmlFor="dueDate">Vencimiento</label>
                <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                />
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
