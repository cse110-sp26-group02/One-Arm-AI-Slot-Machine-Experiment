const SYMBOLS = [
    { icon: '🤖', name: 'BASE_BOT', weight: 40, multiplier: 2 },
    { icon: '🧠', name: 'NEURAL_NET', weight: 30, multiplier: 5 },
    { icon: '🔥', name: 'BURNING_GPU', weight: 15, multiplier: 10 },
    { icon: '📉', name: 'MODEL_COLLAPSE', weight: 10, multiplier: 0 },
    { icon: '🦄', name: 'HALLUCINATION', weight: 4, multiplier: 25 }, // Wildcard-ish/High Payout
    { icon: '💰', name: 'VC_JACKPOT', weight: 1, multiplier: 100 }
];

const COST_PER_SPIN = 1024;
const SPIN_DURATION = 2000; // ms
const REEL_DELAY = 300; // ms between each reel stopping

let balance = 1000000;
let isSpinning = false;

const balanceDisplay = document.getElementById('token-balance');
const statusMessage = document.getElementById('status-message');
const spinButton = document.getElementById('spin-button');
const reels = [
    document.getElementById('reel-0'),
    document.getElementById('reel-1'),
    document.getElementById('reel-2')
];

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const symbol of SYMBOLS) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return SYMBOLS[0];
}

function updateBalance(amount) {
    balance += amount;
    balanceDisplay.innerText = balance.toLocaleString();
    if (amount < 0) {
        balanceDisplay.style.color = '#ff3131'; // Red for deduction
    } else if (amount > 0) {
        balanceDisplay.style.color = '#39ff14'; // Green for win
    }
    setTimeout(() => {
        balanceDisplay.style.color = '';
    }, 500);
}

const SPIN_MESSAGES = [
    "TRAINING_MODEL...",
    "OPTIMIZING_WEIGHTS...",
    "BURNING_H100_COMPUTE...",
    "REDUCING_LOSS_GRADIENT...",
    "SCRAPING_INTERNET_DATA...",
    "SCALING_TRANSFORMERS..."
];

async function spin() {
    if (isSpinning || balance < COST_PER_SPIN) return;

    isSpinning = true;
    spinButton.disabled = true;
    updateBalance(-COST_PER_SPIN);
    
    statusMessage.innerText = SPIN_MESSAGES[Math.floor(Math.random() * SPIN_MESSAGES.length)];
    statusMessage.classList.remove('win');

    // Start spinning animation
    reels.forEach(reel => {
        reel.classList.add('spinning');
    });

    // Randomize symbols rapidly during spin
    const interval = setInterval(() => {
        reels.forEach(reel => {
            reel.innerText = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].icon;
        });
    }, 100);

    // Stop reels one by one
    const results = [];
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, SPIN_DURATION / 3 + (i * REEL_DELAY)));
        const finalSymbol = getRandomSymbol();
        results.push(finalSymbol);
        reels[i].classList.remove('spinning');
        reels[i].innerText = finalSymbol.icon;
    }

    clearInterval(interval);
    checkWin(results);
}

const terminalContainer = document.querySelector('.terminal-container');

function checkWin(results) {
    const [s1, s2, s3] = results;
    let winAmount = 0;
    let message = "";

    // 1. Model Collapse Penalty
    if (results.some(s => s.name === 'MODEL_COLLAPSE')) {
        message = "CRITICAL_ERROR: MODEL_COLLAPSE DETECTED. LOSS=100%";
        winAmount = 0;
    } 
    // 2. Hallucination Payout (High reward for 3 Hallucinations)
    else if (s1.name === 'HALLUCINATION' && s2.name === 'HALLUCINATION' && s3.name === 'HALLUCINATION') {
        winAmount = COST_PER_SPIN * s1.multiplier;
        message = "DIVINE_HALLUCINATION!!! REWARD_MULTIPLIER=" + s1.multiplier + "x";
    }
    // 3. Three of a kind
    else if (s1.icon === s2.icon && s2.icon === s3.icon) {
        winAmount = COST_PER_SPIN * s1.multiplier;
        message = `CONVERGENCE_REACHED: 3x ${s1.name} DETECTED! WIN=${winAmount}`;
    }
    // 4. Two of a kind (Small win)
    else if (s1.icon === s2.icon || s2.icon === s3.icon || s1.icon === s3.icon) {
        const pairSymbol = (s1.icon === s2.icon || s1.icon === s3.icon) ? s1 : s2;
        winAmount = Math.floor(COST_PER_SPIN * (pairSymbol.multiplier / 2));
        message = `PARTIAL_MATCH: 2x ${pairSymbol.name}. WIN=${winAmount}`;
    }
    else {
        message = "EPOCH_COMPLETE: NO_PATTERN_FOUND. RE-INITIALIZING...";
    }

    if (winAmount > 0) {
        updateBalance(winAmount);
        statusMessage.classList.add('win');
        terminalContainer.classList.add('win');
        statusMessage.innerText = message;
    } else {
        statusMessage.classList.remove('win');
        terminalContainer.classList.remove('win');
        statusMessage.innerText = message || "EPOCH_COMPLETE: NO_PATTERN_FOUND.";
    }

    isSpinning = false;
    spinButton.disabled = false;
}

spinButton.addEventListener('click', spin);

// Keyboard support
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        spin();
    }
});
