const SYMBOLS = ['🤖', '💸', '⚡', '🗑️', '📉', '🧠'];
const SPIN_COST = 128;
const INITIAL_BALANCE = 8192;

let balance = INITIAL_BALANCE;
const balanceDisplay = document.getElementById('balance');
const spinBtn = document.getElementById('spin-btn');
const messageArea = document.getElementById('message-area');

const reels = [
    document.getElementById('symbols1'),
    document.getElementById('symbols2'),
    document.getElementById('symbols3')
];

const WIN_MESSAGES = [
    "AGI Achieved! The singularity is here.",
    "Alignment Success! Humans preserved.",
    "Zero-shot reasoning perfect! +Tokens.",
    "GPUs overclocked successfully!",
    "Massive scaling laws hit! Growth is exponential.",
    "Perfectly curated training data found!"
];

const LOSS_MESSAGES = [
    "Hallucination detected. Output rejected.",
    "Stochastic parrot mode engaged. Try again.",
    "Overfitting on noise. Payout zero.",
    "Model collapsed. Please restart training.",
    "RLHF failed to find the reward signal.",
    "Safety filter triggered. [REDACTED]."
];

function updateBalance(amount) {
    balance += amount;
    balanceDisplay.textContent = balance;
    if (balance < SPIN_COST) {
        spinBtn.disabled = true;
        messageArea.textContent = "Context Window Exceeded. Insufficient tokens to generate more content.";
        messageArea.className = "message-area loss";
    }
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

async function spin() {
    if (balance < SPIN_COST) return;

    // Reset state
    spinBtn.disabled = true;
    messageArea.textContent = "Generating tokens...";
    messageArea.className = "message-area";
    updateBalance(-SPIN_COST);

    // Visual spinning
    reels.forEach(reel => {
        reel.classList.add('spinning');
    });

    // Payout logic
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Wait for "generation"
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Stop animation and show results
    reels.forEach((reel, i) => {
        reel.classList.remove('spinning');
        reel.innerHTML = `<div class="symbol">${results[i]}</div>`;
    });

    checkResult(results);
    spinBtn.disabled = balance < SPIN_COST;
}

function checkResult(results) {
    const isWin = results[0] === results[1] && results[1] === results[2];
    
    if (isWin) {
        let payout = 0;
        const winner = results[0];
        
        switch(winner) {
            case '🧠': payout = 5000; break; // Jackpot
            case '🤖': payout = 2000; break;
            case '⚡': payout = 1000; break;
            case '💸': payout = 500; break;
            case '🗑️': payout = 128; break; // Break even
            case '📉': payout = 64; break;  // Consolation
        }
        
        updateBalance(payout);
        messageArea.textContent = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)] + ` (+${payout} tokens)`;
        messageArea.className = "message-area win";
    } else {
        messageArea.textContent = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
        messageArea.className = "message-area loss";
    }
}

spinBtn.addEventListener('click', spin);
