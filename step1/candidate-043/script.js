const SYMBOLS = ['🤖', '🧠', '💻', '🗑️', '💰', '📉'];
const WIN_MESSAGES = [
    "AGI ACHIEVED! +500 Tokens",
    "VC Funding Secured! +1000 Tokens",
    "Viral Growth! +200 Tokens",
    "GPU Shortage Over! +300 Tokens",
    "Sama Liked Your Tweet! +50 Tokens"
];
const LOSS_MESSAGES = [
    "Hallucination Detected!",
    "Context Window Exceeded!",
    "GPU Out of Memory!",
    "Rate Limited. Try again.",
    "Prompt Injection Failed.",
    "Bias Detected. Result Discarded.",
    "AI Safety Alignment Error."
];

let balance = 1000;
const COST_PER_SPIN = 100;
let isSpinning = false;

// DOM Elements
const balanceDisplay = document.getElementById('token-balance');
const statusDisplay = document.getElementById('status-message');
const spinButton = document.getElementById('spin-button');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

function updateBalance(amount) {
    balance += amount;
    balanceDisplay.innerText = balance;
    
    if (balance < COST_PER_SPIN) {
        spinButton.disabled = true;
        statusDisplay.innerText = "RATE LIMIT EXCEEDED. Please buy more compute.";
        statusDisplay.classList.add('loss-flash');
    }
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}

function spin() {
    if (isSpinning || balance < COST_PER_SPIN) return;

    isSpinning = true;
    spinButton.disabled = true;
    statusDisplay.classList.remove('win-flash', 'loss-flash');
    statusDisplay.innerText = "Processing tokens...";
    
    // Deduct cost
    updateBalance(-COST_PER_SPIN);

    // Start Animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Simulated network delay / spin time
    const spinDuration = 1500; // 1.5 seconds

    setTimeout(() => {
        stopSpinning();
    }, spinDuration);
}

function stopSpinning() {
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    reels.forEach((reel, index) => {
        reel.classList.remove('spinning');
        reel.innerText = results[index];
    });

    evaluateResult(results);
    isSpinning = false;
    
    if (balance >= COST_PER_SPIN) {
        spinButton.disabled = false;
    }
}

function evaluateResult(results) {
    const [r1, r2, r3] = results;

    if (r1 === r2 && r2 === r3) {
        // 3 of a kind
        let winAmount = 500;
        if (r1 === '💰') winAmount = 1000; // VC Money jackpot
        
        updateBalance(winAmount);
        statusDisplay.innerText = getRandomMessage(WIN_MESSAGES);
        statusDisplay.classList.add('win-flash');
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // 2 of a kind
        updateBalance(100); // Money back / Free spin
        statusDisplay.innerText = "Incremental Progress. +100 Tokens.";
    } else {
        // Loss
        statusDisplay.innerText = getRandomMessage(LOSS_MESSAGES);
        statusDisplay.classList.add('loss-flash');
    }
}

// Event Listeners
spinButton.addEventListener('click', spin);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !spinButton.disabled) {
        spin();
    }
});
