const SYMBOLS = ['🧠', '🤖', '💸', '📉', '☁️', '🌶️'];
const SPIN_COST = 1000;
const INITIAL_BALANCE = 100000;

const PAYOUTS = {
    '🧠': 100000,
    '🤖': 50000,
    '💸': 25000,
    '📉': 10000,
    '☁️': 5000,
};

const WIN_MESSAGES = [
    "AGI ACHIEVED! Tokens overflowing!",
    "HALLUCINATION JACKPOT! Errors are now features!",
    "SUPERINTELLIGENCE DETECTED! Printing tokens...",
    "VC FUNDING SECURED! Burn rate increased!",
    "H100 SHORTAGE OVER! You have the compute!",
];

const LOSS_MESSAGES = [
    "Context window exceeded. Try again.",
    "Rate limited! Buy more GPU time.",
    "Tokens exhausted. Re-indexing...",
    "Optimization failed. Cost: 1,000 tokens.",
    "Temperature too high! Result discarded.",
];

let balance = INITIAL_BALANCE;
let isSpinning = false;

const balanceDisplay = document.getElementById('balance-value');
const spinButton = document.getElementById('spin-button');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const messageDisplay = document.getElementById('message');

function updateUI() {
    balanceDisplay.textContent = balance.toLocaleString();
    if (balance < SPIN_COST) {
        spinButton.disabled = true;
        messageDisplay.textContent = "Insufficient Tokens. Please restart the simulation.";
        messageDisplay.className = "loss";
    }
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function evaluateWin(results) {
    const counts = {};
    let wildcardCount = 0;

    results.forEach(sym => {
        if (sym === '🌶️') {
            wildcardCount++;
        } else {
            counts[sym] = (counts[sym] || 0) + 1;
        }
    });

    // Check for 3 of a kind (including wildcards)
    for (let sym of Object.keys(PAYOUTS)) {
        if ((counts[sym] || 0) + wildcardCount >= 3) {
            return { symbol: sym, amount: PAYOUTS[sym] };
        }
    }

    // Special case: 3 wildcards
    if (wildcardCount === 3) {
        return { symbol: '🧠', amount: PAYOUTS['🧠'] };
    }

    return null;
}

async function spin() {
    if (isSpinning || balance < SPIN_COST) return;

    isSpinning = true;
    balance -= SPIN_COST;
    updateUI();

    messageDisplay.textContent = "Tokenizing prompt...";
    messageDisplay.className = "";
    spinButton.disabled = true;

    // Start spinning animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Artificial delay for the "spin"
    await new Promise(resolve => setTimeout(resolve, 1500));

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Stop animation and show results sequentially
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        reels[i].classList.remove('spinning');
        reels[i].textContent = results[i];
    }

    const win = evaluateWin(results);

    if (win) {
        balance += win.amount;
        messageDisplay.textContent = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
        messageDisplay.className = "win";
    } else {
        messageDisplay.textContent = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
        messageDisplay.className = "loss";
    }

    isSpinning = false;
    spinButton.disabled = balance < SPIN_COST;
    updateUI();
}

spinButton.addEventListener('click', spin);

// Initial UI setup
updateUI();
