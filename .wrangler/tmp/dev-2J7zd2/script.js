addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);

    // Handle POST requests to /api/calculate
    if (request.method === 'POST' && url.pathname === '/api/calculate') {
        try {
            const data = await request.json();
            const { targetIncome, billableHours, workWeeks, nonBillablePercent, expenses, taxBuffer, projectHours } = data;

            // Perform calculations
            const effectiveHoursPerWeek = billableHours * (1 - nonBillablePercent / 100);
            const totalHoursPerMonth = effectiveHoursPerWeek * workWeeks;
            const requiredPreTaxIncome = targetIncome + expenses;
            const totalRequiredIncome = requiredPreTaxIncome / (1 - taxBuffer / 100);
            const hourlyRate = totalRequiredIncome / totalHoursPerMonth;
            const projectRate = hourlyRate * projectHours;
            const annualIncome = hourlyRate * effectiveHoursPerWeek * workWeeks * 12;

            // Create response object
            const response = {
                hourlyRate: hourlyRate.toFixed(2),
                projectRate: projectRate.toFixed(2),
                annualIncome: annualIncome.toFixed(2),
            };

            return new Response(JSON.stringify(response), {
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            return new Response('Invalid input', { status: 400 });
        }
    }

    // Default response for other requests
    return new Response('Hello, World!', { status: 200 });
}

// Client-side code (to be included in a separate client.js file)
document.addEventListener("DOMContentLoaded", function() {
    const basicCalc = new BasicCalculator();
    const scientificCalc = new ScientificCalculator();
    const cryptoCalc = new CryptocurrencyCalculator();
    const unitConverter = new UnitConverter();
    const history = new CalculationHistory();
    const themeManager = new ThemeManager();
    
    const calculateRateBtn = document.getElementById("calculate-rate");
    const resetFreelanceBtn = document.getElementById("reset-freelance");
    const copyRateBtn = document.getElementById("copy-rate");

    if (calculateRateBtn) {
        calculateRateBtn.addEventListener("click", calculateFreelanceRate);
    }
    if (resetFreelanceBtn) {
        resetFreelanceBtn.addEventListener("click", resetFreelanceCalculator);
    }
    if (copyRateBtn) {
        copyRateBtn.addEventListener("click", copyRateToClipboard);
    }

    const projectHoursInput = document.getElementById("project-hours");
    if (projectHoursInput) {
        projectHoursInput.addEventListener("input", function() {
            document.getElementById("project-hours-display").textContent = this.value;
        });
    }

    function calculateFreelanceRate() {
        const targetIncome = parseFloat(document.getElementById("target-income").value);
        const billableHours = parseFloat(document.getElementById("billable-hours").value);
        const workWeeks = parseFloat(document.getElementById("work-weeks").value);
        const nonBillablePercent = parseFloat(document.getElementById("non-billable").value);
        const expenses = parseFloat(document.getElementById("expenses").value);
        const taxBuffer = parseFloat(document.getElementById("tax-buffer").value);
        const projectHours = parseFloat(document.getElementById("project-hours").value);

        const effectiveHoursPerWeek = billableHours * (1 - nonBillablePercent / 100);
        document.getElementById("effective-hours").textContent = effectiveHoursPerWeek.toFixed(1);
        const totalHoursPerMonth = effectiveHoursPerWeek * workWeeks;
        const requiredPreTaxIncome = targetIncome + expenses;
        const totalRequiredIncome = requiredPreTaxIncome / (1 - taxBuffer / 100);
        const hourlyRate = totalRequiredIncome / totalHoursPerMonth;
        document.getElementById("hourly-rate").textContent = "$" + hourlyRate.toFixed(2);
        const projectRate = hourlyRate * projectHours;
        document.getElementById("project-rate").textContent = "$" + projectRate.toFixed(2);
        const annualIncome = hourlyRate * effectiveHoursPerWeek * workWeeks * 12;
        document.getElementById("annual-income").textContent = "$" + annualIncome.toFixed(2);

        const resultCards = document.querySelectorAll(".result-card");
        resultCards.forEach((card) => {
            card.style.animation = "none";
            setTimeout(() => {
                card.style.animation = "pulse 0.5s";
            }, 10);
        });
        history.addCalculation("Freelance Rate", `$${targetIncome} target income`, `$${hourlyRate.toFixed(2)}/hour`);
    }

    function resetFreelanceCalculator() {
        document.getElementById("target-income").value = 5000;
        document.getElementById("billable-hours").value = 30;
        document.getElementById("work-weeks").value = 4;
        document.getElementById("non-billable").value = 30;
        document.getElementById("expenses").value = 500;
        document.getElementById("tax-buffer").value = 20;
        document.getElementById("project-hours").value = 10;
        document.getElementById("project-hours-display").textContent = 10;
        document.getElementById("effective-hours").textContent = "0";
        document.getElementById("hourly-rate").textContent = "$0";
        document.getElementById("project-rate").textContent = "$0";
        document.getElementById("annual-income").textContent = "$0";
    }

    function copyRateToClipboard() {
        const hourlyRate = document.getElementById("hourly-rate").textContent;
        navigator.clipboard.writeText(hourlyRate).then(() => {
            showToast("Rate copied to clipboard!");
        }).catch(() => {
            const tempInput = document.createElement("input");
            tempInput.value = hourlyRate;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            showToast("Rate copied to clipboard!");
        });
    }

    // Additional functions for other calculators can be added here
});

// Additional classes for calculators and utilities
class BasicCalculator {
    // Basic calculator implementation
}

class ScientificCalculator extends BasicCalculator {
    // Scientific calculator implementation
}

class CryptocurrencyCalculator {
    // Cryptocurrency calculator implementation
}

class UnitConverter {
    // Unit converter implementation
}

class CalculationHistory {
    // Calculation history implementation
}

class ThemeManager {
    // Theme manager implementation
}

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function toggleHistory() {
    const panel = document.getElementById("history-panel");
    if (panel) {
        panel.classList.toggle("show");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Load input states and initialize history
}); 
// Crypto Calculator - Works with GitHub Pages (no backend needed)
// Add this to your existing script.js file

// Initialize crypto calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const cryptoCalculateBtn = document.getElementById('crypto-calculate-btn');
    if (cryptoCalculateBtn) {
        cryptoCalculateBtn.addEventListener('click', calculateCrypto);
        
        // Also calculate on Enter key
        document.getElementById('crypto-amount')?.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculateCrypto();
        });
        
        // Load initial price for BTC/USD
        calculateCrypto();
    }
});

async function calculateCrypto() {
    const amount = parseFloat(document.getElementById('crypto-amount').value) || 1;
    const from = document.getElementById('crypto-from').value;
    const to = document.getElementById('crypto-to').value;
    
    // Show loading state
    const resultAmount = document.getElementById('crypto-result-amount');
    const originalText = resultAmount.textContent;
    resultAmount.textContent = 'Loading...';
    
    try {
        let price = 0;
        let marketCap = 0;
        let change24h = 0;
        
        // Check if converting between two cryptocurrencies
        if (isCrypto(from) && isCrypto(to)) {
            // Get both prices in USD first
            const fromData = await fetchCryptoPrice(from, 'USD');
            const toData = await fetchCryptoPrice(to, 'USD');
            
            price = fromData.price / toData.price;
            marketCap = fromData.marketCap;
            change24h = fromData.change24h;
        } else if (isCrypto(from)) {
            // Converting crypto to fiat
            const data = await fetchCryptoPrice(from, to);
            price = data.price;
            marketCap = data.marketCap;
            change24h = data.change24h;
        } else if (isCrypto(to)) {
            // Converting fiat to crypto
            const data = await fetchCryptoPrice(to, from);
            price = 1 / data.price;
            marketCap = data.marketCap;
            change24h = -data.change24h; // Inverse change
        } else {
            // Fiat to fiat conversion
            price = await fetchFiatRate(from, to);
        }
        
        const total = amount * price;
        
        // Update UI with results
        document.getElementById('crypto-result-amount').textContent = formatNumber(total);
        document.getElementById('crypto-result-currency').textContent = to;
        document.getElementById('crypto-rate-from').textContent = from;
        document.getElementById('crypto-rate-value').textContent = formatNumber(price);
        document.getElementById('crypto-rate-to').textContent = to;
        
        // Update crypto info if applicable
        if (isCrypto(from)) {
            document.getElementById('crypto-current-price').textContent = formatNumber(price);
            document.getElementById('crypto-24h-change').textContent = change24h.toFixed(2);
            document.getElementById('crypto-market-cap').textContent = formatMarketCap(marketCap);
            
            // Color code the 24h change
            const changeElement = document.getElementById('crypto-24h-change');
            changeElement.style.color = change24h >= 0 ? '#4CAF50' : '#f44336';
            changeElement.textContent = (change24h >= 0 ? '+' : '') + change24h.toFixed(2) + '%';
        }
        
        // Animate the result
        resultAmount.style.animation = 'none';
        setTimeout(() => {
            resultAmount.style.animation = 'pulse 0.5s';
        }, 10);
        
    } catch (error) {
        console.error('Error calculating crypto:', error);
        resultAmount.textContent = 'Error';
        
        // Show error message
        setTimeout(() => {
            alert('Unable to fetch current prices. Please check your internet connection and try again.');
        }, 100);
    }
}

async function fetchCryptoPrice(crypto, fiat) {
    // Map crypto symbols to CoinGecko IDs
    const cryptoMap = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'BNB': 'binancecoin',
        'ADA': 'cardano',
        'DOGE': 'dogecoin',
        'XRP': 'ripple',
        'DOT': 'polkadot',
        'UNI': 'uniswap',
        'LTC': 'litecoin',
        'LINK': 'chainlink',
        'SOL': 'solana',
        'MATIC': 'matic-network'
    };
    
    const cryptoId = cryptoMap[crypto] || 'bitcoin';
    const vsCurrency = fiat.toLowerCase();
    
    // Use CoinGecko API (free, no API key needed, supports CORS)
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=${vsCurrency}&include_market_cap=true&include_24hr_change=true`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch crypto price');
    
    const data = await response.json();
    
    return {
        price: data[cryptoId][vsCurrency] || 0,
        marketCap: data[cryptoId][`${vsCurrency}_market_cap`] || 0,
        change24h: data[cryptoId][`${vsCurrency}_24h_change`] || 0
    };
}

async function fetchFiatRate(from, to) {
    // For fiat-to-fiat, we can use exchangerate-api.com (free tier)
    // Or use a fixed rate table as fallback
    const fixedRates = {
        'USD': { 'EUR': 0.85, 'GBP': 0.73, 'JPY': 110.0, 'AUD': 1.35, 'CAD': 1.25 },
        'EUR': { 'USD': 1.18, 'GBP': 0.86, 'JPY': 129.0, 'AUD': 1.59, 'CAD': 1.47 },
        'GBP': { 'USD': 1.37, 'EUR': 1.16, 'JPY': 150.0, 'AUD': 1.85, 'CAD': 1.71 }
    };
    
    if (from === to) return 1;
    
    // Try to get from fixed rates
    if (fixedRates[from] && fixedRates[from][to]) {
        return fixedRates[from][to];
    }
    
    // As fallback, try to fetch from a free API
    try {
        const url = `https://api.exchangerate-api.com/v4/latest/${from}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.rates[to] || 1;
    } catch {
        // If API fails, return 1 as fallback
        return 1;
    }
}

function isCrypto(symbol) {
    const cryptos = ['BTC', 'ETH', 'BNB', 'ADA', 'DOGE', 'XRP', 'DOT', 'UNI', 'LTC', 'LINK', 'SOL', 'MATIC'];
    return cryptos.includes(symbol);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    } else if (num >= 1) {
        return num.toFixed(2);
    } else if (num >= 0.01) {
        return num.toFixed(4);
    } else {
        return num.toFixed(8);
    }
}

function formatMarketCap(cap) {
    if (cap >= 1e12) {
        return (cap / 1e12).toFixed(2) + 'T';
    } else if (cap >= 1e9) {
        return (cap / 1e9).toFixed(2) + 'B';
    } else if (cap >= 1e6) {
        return (cap / 1e6).toFixed(2) + 'M';
    } else {
        return cap.toLocaleString();
    }
}

// Optional: Add real-time updates every 30 seconds
let cryptoUpdateInterval;

function startCryptoUpdates() {
    // Clear any existing interval
    if (cryptoUpdateInterval) {
        clearInterval(cryptoUpdateInterval);
    }
    
    // Update every 30 seconds
    cryptoUpdateInterval = setInterval(() => {
        const btn = document.getElementById('crypto-calculate-btn');
        if (btn && document.visibilityState === 'visible') {
            calculateCrypto();
        }
    }, 30000);
}

// Start updates when crypto calculator is visible
const cryptoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCryptoUpdates();
        } else {
            if (cryptoUpdateInterval) {
                clearInterval(cryptoUpdateInterval);
            }
        }
    });
});

// Observe the crypto calculator element
const cryptoCalculator = document.getElementById('crypto-calculator');
if (cryptoCalculator) {
    cryptoObserver.observe(cryptoCalculator);
}

// Add some helpful CSS animations
const cryptoStyles = `
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.crypto-result {
    transition: all 0.3s ease;
}

.crypto-info-details p {
    transition: color 0.3s ease;
}
`;

// Inject the styles
const styleSheet = document.createElement('style');
styleSheet.textContent = cryptoStyles;
document.head.appendChild(styleSheet);
