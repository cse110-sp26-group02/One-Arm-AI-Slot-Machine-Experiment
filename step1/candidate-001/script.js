const displaySymbols = ['🪙', '🧠', '🤖', '🖥️', '📉', '📚', '🤡'];

const balanceEl = document.getElementById('balance');
const slot1El = document.getElementById('slot1');
const slot2El = document.getElementById('slot2');
const slot3El = document.getElementById('slot3');
const spinBtn = document.getElementById('spin-btn');
const messageEl = document.getElementById('message');

let balance = 10000;
const costPerSpin = 1000;
let isSpinning = false;

// Weights for symbols (higher means more likely)
const symbolWeights = [
    { symbol: '🪙', weight: 25 }, // Token
    { symbol: '🧠', weight: 20 }, // Brain
    { symbol: '🤖', weight: 15 }, // Robot
    { symbol: '🖥️', weight: 5 },  // GPU is rare
    { symbol: '📉', weight: 20 }, // Rate limit
    { symbol: '📚', weight: 20 }, // Books/Data
    { symbol: '🤡', weight: 15 }  // Hallucination
];

function getRandomSymbol() {
    const totalWeight = symbolWeights.reduce((sum, item) => sum + item.weight, 0);
    let randomNum = Math.random() * totalWeight;
    
    for (const item of symbolWeights) {
        if (randomNum < item.weight) {
            return item.symbol;
        }
        randomNum -= item.weight;
    }
    return '🤖'; // Fallback
}

function updateBalance(amount) {
    balance += amount;
    balanceEl.textContent = balance.toLocaleString();
}

function checkWin(s1, s2, s3) {
    if (s1 === s2 && s2 === s3) {
        if (s1 === '🪙') return { amount: 5000, msg: "Jackpot! Seed money acquired! (+5,000 Tokens)" };
        if (s1 === '🧠') return { amount: 10000, msg: "AGI Achieved! (+10,000 Tokens)" };
        if (s1 === '🤖') return { amount: 20000, msg: "Robot Uprising Successful! (+20,000 Tokens)" };
        if (s1 === '🖥️') return { amount: 50000, msg: "H100 Cluster Secured! (+50,000 Tokens)" };
        if (s1 === '🤡') return { amount: 0, msg: "Complete Hallucination. Zero value." };
        if (s1 === '📚') return { amount: 2000, msg: "Training Data Scraped! (+2,000 Tokens)" };
        if (s1 === '📉') return { amount: -5000, msg: "Server Melted down. (-5,000 Tokens)" };
    }
    
    if (s1 === '📉' || s2 === '📉' || s3 === '📉') {
         return { amount: -500, msg: "Rate Limit Exceeded. Penalty applied. (-500 Tokens)" };
    }

    if (s1 === '🤡' || s2 === '🤡' || s3 === '🤡') {
         return { amount: 0, msg: "Model hallucinated a fake response. Nothing gained." };
    }

    return { amount: 0, msg: "Output generated: Complete gibberish. Try again." };
}

async function spin() {
    if (isSpinning) return;
    
    if (balance < costPerSpin) {
        messageEl.textContent = "Insufficient tokens! Please upgrade your API tier.";
        messageEl.style.color = "#ef4444";
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    updateBalance(-costPerSpin);
    messageEl.textContent = "Generating response...";
    messageEl.style.color = "#10b981";

    const slots = [slot1El, slot2El, slot3El];
    slots.forEach(slot => slot.classList.add('spinning'));

    // Spin animation duration
    const spinDuration = 1500;
    const interval = 80;
    let elapsed = 0;

    const spinInterval = setInterval(() => {
        slots.forEach(slot => {
            slot.textContent = displaySymbols[Math.floor(Math.random() * displaySymbols.length)];
        });
        elapsed += interval;
        if (elapsed >= spinDuration) {
            clearInterval(spinInterval);
        }
    }, interval);

    // Wait for animation to finish
    await new Promise(resolve => setTimeout(resolve, spinDuration));

    slots.forEach(slot => slot.classList.remove('spinning'));

    const finalS1 = getRandomSymbol();
    const finalS2 = getRandomSymbol();
    const finalS3 = getRandomSymbol();

    slot1El.textContent = finalS1;
    slot2El.textContent = finalS2;
    slot3El.textContent = finalS3;

    const result = checkWin(finalS1, finalS2, finalS3);
    
    if (result.amount > 0) {
        messageEl.style.color = "#f59e0b"; // Gold for win
    } else if (result.amount < 0) {
        messageEl.style.color = "#ef4444"; // Red for loss/penalty
    } else {
        messageEl.style.color = "#94a3b8"; // Gray for nothing
    }
    
    messageEl.textContent = result.msg;
    updateBalance(result.amount);

    isSpinning = false;
    spinBtn.disabled = false;
}

spinBtn.addEventListener('click', spin);