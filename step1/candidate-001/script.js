const symbols = ['🧠', '💾', '⚡', '💬', '🐛'];
const payouts = {
    '🧠': 5000,
    '💾': 2000,
    '⚡': 1000,
    '💬': 500
};

let tokens = 10000;
const spinCost = 100;

const tokenDisplay = document.getElementById('token-balance');
const statusDisplay = document.getElementById('status-message');
const spinBtn = document.getElementById('spin-btn');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

function updateDisplay() {
    tokenDisplay.textContent = `Tokens: ${tokens.toLocaleString()}`;
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

async function spin() {
    if (tokens < spinCost) {
        statusDisplay.textContent = "Error: Insufficient Tokens for Compute.";
        return;
    }

    // Deduct tokens
    tokens -= spinCost;
    updateDisplay();
    
    spinBtn.disabled = true;
    statusDisplay.textContent = "Processing Inference...";
    
    // Add spinning animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Random symbols to show during "spin"
    const interval = setInterval(() => {
        reels.forEach(reel => {
            reel.textContent = getRandomSymbol();
        });
    }, 100);

    // Resolve spin after 2 seconds
    setTimeout(() => {
        clearInterval(interval);
        reels.forEach(reel => reel.classList.remove('spinning'));
        
        const results = reels.map(() => getRandomSymbol());
        results.forEach((symbol, index) => {
            reels[index].textContent = symbol;
        });

        calculateResult(results);
        spinBtn.disabled = false;
    }, 2000);
}

function calculateResult(results) {
    const [r1, r2, r3] = results;

    if (r1 === r2 && r2 === r3) {
        const winAmount = payouts[r1] || 0;
        if (winAmount > 0) {
            tokens += winAmount;
            statusDisplay.textContent = `Success! +${winAmount} Tokens generated.`;
            statusDisplay.style.color = 'var(--terminal-green)';
        } else if (r1 === '🐛') {
            statusDisplay.textContent = "Critical Hallucination Detected. 0 Payout.";
            statusDisplay.style.color = 'var(--neon-purple)';
        }
    } else {
        // Random "AI failure" messages
        const failures = [
            "Context window exceeded.",
            "Token limit reached.",
            "Model collapsed.",
            "Inference timed out.",
            "Prompt rejected by safety filter."
        ];
        statusDisplay.textContent = failures[Math.floor(Math.random() * failures.length)];
        statusDisplay.style.color = 'var(--text-color)';
    }

    updateDisplay();
}

spinBtn.addEventListener('click', spin);
updateDisplay();