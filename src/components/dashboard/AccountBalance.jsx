export default function AccountBalance({
    accountBalance,
    formatAmount,
}) {

    return (
        <div className="d-flex fd-row fs-24px jc-between ai-end w-100">
            <p>Saldo:</p>
            {accountBalance < 0 ? 
            <strong className="fc-red">{formatAmount(accountBalance)}</strong>
            :
            <strong className="fc-green-logo">{formatAmount(accountBalance)}</strong>
            }
        </div>
    );
}
