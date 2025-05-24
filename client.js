document.getElementById('calculate-button').addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('crypto-amount').value) || 0;
    const fromSelect = document.getElementById('crypto-from');
    const toSelect = document.getElementById('crypto-to');

    if (!fromSelect || !toSelect) return;

    const fromCrypto = fromSelect.value;
    const toCurrency = toSelect.value;

    if (amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    const response = await fetch('/calculate', {
        method: 'POST',
        body: JSON.stringify({ amount, fromCrypto, toCurrency }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        const result = await response.json();
        document.getElementById('crypto-result').textContent = `${result.amount} ${result.toCurrency}`;
    } else {
        alert('Error calculating the result');
    }
});