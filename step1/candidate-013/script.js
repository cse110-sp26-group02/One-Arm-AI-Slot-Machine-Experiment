const symbols = ['🤖', '🧠', '💸', '📉', '🖥️', '🗑️'];
const spinCost = 10;
let balance = 1000;
let isSpinning = false;

const balanceEl = document.getElementById('token-balance');
const reel1El = document.getElementById('reel1');
const reel2El = document.getElementById('reel2');
const reel3El = document.getElementById('reel3');
const spinBtn = document.getElementById('spin-btn');
const messageEl = document.getElementById('message');

const messages = {
    start: "Ready to consume compute?",
    spinning: [
        "Generating hallucination...",
        "Querying latent space...",
        "Optimizing loss function...",
        "Scaling up parameters...",
        "Bypassing safety filters..."
    ],
    win: [
        "Jackpot! 1M context window unlocked!",
        "AGI achieved! (Just kidding, here are some tokens)",
        "Zero-shot success! Huge payout!",
        "Model weights successfully stolen. You win!"
    ],
    lose: [
        "Model collapsed. Tokens wasted.",
        "Rate limit exceeded. Try again.",
        "Hallucinated a win, but actually lost.",
        "Overfitted to the training data. No payout."
    ],
    bankrupt: [
        "Out of tokens. Please upgrade to Pro tier.",
        "Compute exhausted. Session terminated."
    ]
};

function updateBalance(amount) {
    balance += amount;
    balanceEl.textContent = balance;
    if (balance < spinCost) {
        spinBtn.disabled = true;
        messageEl.textContent = messages.bankrupt[Math.floor(Math.random() * messages.bankrupt.length)];
    }
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function getRandomMessage(type) {
    const list = messages[type];
    return list[Math.floor(Math.random() * list.length)];
}

async function spin() {
    if (isSpinning || balance < spinCost) return;

    isSpinning = true;
    spinBtn.disabled = true;
    updateBalance(-spinCost);
    messageEl.textContent = getRandomMessage('spinning');
    messageEl.style.color = '#ffffaa';

    const reels = [reel1El, reel2El, reel3El];
   
    // Add spinning animation class
    reels.forEach(r => r.classList.add('spinning'));

    // Fake spin duration
    const spinDuration = 2000;
    const interval = 100;
    let elapsed = 0;

    const spinInterval = setInterval(() => {
        reels.forEach(r => {
            r.textContent = getRandomSymbol();
        });
        elapsed += interval;
        if (elapsed >= spinDuration) {
            clearInterval(spinInterval);
            finishSpin();
        }
    }, interval);
}

function finishSpin() {
    const r1 = getRandomSymbol();
    const r2 = getRandomSymbol();
    const r3 = getRandomSymbol();

    reel1El.textContent = r1;
    reel2El.textContent = r2;
    reel3El.textContent = r3;

    const reels = [reel1El, reel2El, reel3El];
    reels.forEach(r => r.classList.remove('spinning'));

    checkWin(r1, r2, r3);
   
    isSpinning = false;
    if (balance >= spinCost) {
        spinBtn.disabled = false;
    }
}

function checkWin(r1, r2, r3) {
    if (r1 === r2 && r2 === r3) {
        // 3 of a kind
        let winAmount = 100;
        if (r1 === '🤖') winAmount = 500;
        else if (r1 === '🧠') winAmount = 250;
        else if (r1 === '🗑️') winAmount = -50; // Special penalty
       
        updateBalance(winAmount);
        if (winAmount > 0) {
            messageEl.textContent = `Won ${winAmount} tokens! ${getRandomMessage('win')}`;
            messageEl.style.color = '#00ff00';
        } else {
             messageEl.textContent = `Garbage in, garbage out! Lost ${Math.abs(winAmount)} extra tokens.`;
             messageEl.style.color = '#ff5555';
        }
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // 2 of a kind
        const winAmount = 20;
        updateBalance(winAmount);
        messageEl.textContent = `Won ${winAmount} tokens! Partial match found in latent space.`;
        messageEl.style.color = '#aaffaa';
    } else {
        // Loss
        messageEl.textContent = getRandomMessage('lose');
        messageEl.style.color = '#ff5555';
    }
}

spinBtn.addEventListener('click', spin);

// Initialize
messageEl.textContent = messages.start;
