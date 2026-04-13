const symbols = ['🤖', '💰', '⚡', '🧠', '🦜', '📉'];
const rewards = {
    '🤖': 5000,
    '💰': 1000,
    '⚡': 500,
    '🧠': 200,
    '🦜': 50,
    '📉': -100
};

let tokens = 1000;
let isSpinning = false;

const tokenDisplay = document.getElementById('token-count');
const contextUsageDisplay = document.getElementById('context-usage');
const tempInput = document.getElementById('temperature');
const tempVal = document.getElementById('temp-val');
const spinBtn = document.getElementById('spin-button');
const statusDisplay = document.getElementById('status-display');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

tempInput.addEventListener('input', (e) => {
    tempVal.textContent = e.target.value;
});

function updateDisplay() {
    tokenDisplay.textContent = tokens;
    const usage = Math.min(100, Math.floor((1000 - tokens) / 10));
    contextUsageDisplay.textContent = `${usage > 0 ? usage : 0}%`;
   
    if (tokens < 50) {
        spinBtn.disabled = true;
        spinBtn.textContent = "INSUFFICIENT TOKENS";
    }
}

function getRandomSymbol(temp) {
    // Higher temperature adds more randomness or bias towards certain outcomes
    // Here, we just use it to potentially "hallucinate" more '📉' at high temps
    let effectiveSymbols = [...symbols];
    if (temp > 1.5) {
        effectiveSymbols.push('📉', '📉', '📉'); // More hallucinations
    } else if (temp < 0.3) {
        effectiveSymbols = ['🤖', '🧠', '⚡']; // More "stable" but smaller pool (not how slots work but fits theme)
    }
   
    return effectiveSymbols[Math.floor(Math.random() * effectiveSymbols.length)];
}

async function spin() {
    if (isSpinning || tokens < 50) return;

    isSpinning = true;
    tokens -= 50;
    updateDisplay();
   
    spinBtn.disabled = true;
    statusDisplay.textContent = "Inference in progress...";
    statusDisplay.classList.remove('win-pulse');

    const temp = parseFloat(tempInput.value);
    const results = [
        getRandomSymbol(temp),
        getRandomSymbol(temp),
        getRandomSymbol(temp)
    ];

    // Start animation
    reels.forEach(reel => {
        reel.querySelector('.reel-content').classList.add('spinning');
    });

    // Staggered stop
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + i * 500));
        const reelContent = reels[i].querySelector('.reel-content');
        reelContent.classList.remove('spinning');
        reelContent.textContent = results[i];
    }

    checkWin(results);
    isSpinning = false;
    if (tokens >= 50) spinBtn.disabled = false;
}

function checkWin(results) {
    if (results[0] === results[1] && results[1] === results[2]) {
        const symbol = results[0];
        const winAmount = rewards[symbol];
        tokens += winAmount;
       
        if (winAmount > 0) {
            statusDisplay.textContent = `SUCCESS: Generated +${winAmount} Tokens!`;
            statusDisplay.classList.add('win-pulse');
        } else {
            statusDisplay.textContent = `CRITICAL FAILURE: Hallucination detected (${winAmount})`;
        }
    } else {
        statusDisplay.textContent = "Inference complete. No meaningful output.";
    }
    updateDisplay();
}

spinBtn.addEventListener('click', spin);

// Initial display update
updateDisplay();
