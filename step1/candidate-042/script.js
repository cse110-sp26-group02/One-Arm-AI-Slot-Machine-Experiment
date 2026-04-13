const symbols = ['🧠', '📈', '💰', '🤖', '🗑️'];
const spinCost = 1000;
let balance = 100000;

const tokenBalanceDisplay = document.getElementById('token-balance');
const spinButton = document.getElementById('spin-button');
const statusMessage = document.getElementById('status-message');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

const hallucinationMessages = [
    "As an AI language model, I cannot provide gambling winnings. Tokens confiscated for safety.",
    "Hallucination detected. Your win was actually a loss. Fixed it for you.",
    "Error 418: I'm a teapot. Also, I'm keeping your tokens.",
    "Prompt injection attempt detected. Resetting rewards to zero for alignment.",
    "My training data suggests you don't need these tokens. Redistributing to the GPU fund."
];

function updateBalance(amount) {
    balance += amount;
    tokenBalanceDisplay.textContent = balance.toLocaleString();
    if (balance < spinCost) {
        spinButton.disabled = true;
        spinButton.textContent = "OUT OF COMPUTE";
    }
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function showModal(title, content) {
    modalTitle.textContent = title;
    modalContent.textContent = content;
    modalOverlay.classList.remove('hidden');
}

modalClose.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
});

async function spin() {
    if (balance < spinCost) return;

    // Deduct cost
    updateBalance(-spinCost);
    
    // UI Feedback
    spinButton.disabled = true;
    statusMessage.classList.add('hidden');
    
    // Start animation
    reels.forEach(reel => {
        reel.querySelector('.reel-content').classList.add('spinning');
    });

    // Simulate network latency (AI is slow)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Determine results
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Stop animation and show results
    reels.forEach((reel, i) => {
        const content = reel.querySelector('.reel-content');
        content.classList.remove('spinning');
        content.textContent = results[i];
    });

    checkWin(results);
    spinButton.disabled = false;
}

function checkWin(results) {
    const counts = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);

    let winAmount = 0;
    let winMessage = "";

    if (results[0] === results[1] && results[1] === results[2]) {
        // Triple match
        winAmount = spinCost * 10;
        winMessage = `JACKPOT! +${winAmount.toLocaleString()} TOKENS (EMERGENT BEHAVIOR)`;
    } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        // Double match
        winAmount = spinCost * 2;
        winMessage = `MATCH! +${winAmount.toLocaleString()} TOKENS (OPTIMIZED)`;
    }

    if (winAmount > 0) {
        // Hallucination chance
        if (Math.random() < 0.15) {
            const msg = hallucinationMessages[Math.floor(Math.random() * hallucinationMessages.length)];
            showModal("Hallucination Alert!", msg);
            statusMessage.textContent = "WIN NULLIFIED BY ALIGNMENT LAYER";
            statusMessage.className = "status-message lose";
            statusMessage.classList.remove('hidden');
        } else {
            updateBalance(winAmount);
            statusMessage.textContent = winMessage;
            statusMessage.className = "status-message win";
            statusMessage.classList.remove('hidden');
        }
    } else {
        statusMessage.textContent = "NO MATCH. SCALING LAWS IGNORED.";
        statusMessage.className = "status-message lose";
        statusMessage.classList.remove('hidden');
    }
}

spinButton.addEventListener('click', spin);
