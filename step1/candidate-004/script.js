const SYMBOLS = ['🧠', '🤖', '📈', '💸', '🗑️'];
const COST_PER_SPIN = 10;
const INITIAL_BALANCE = 1000;

const PAYTABLE = {
    '🧠🧠🧠': { payout: 500, message: "AGI Achieved! +500 tokens" },
    '🤖🤖🤖': { payout: 250, message: "Agents Synchronized! +250 tokens" },
    '📈📈📈': { payout: 100, message: "Hype Train Boarded! +100 tokens" },
    '💸💸💸': { payout: -50, message: "Cloud Bill Arrived. -50 extra tokens" },
    '🗑️🗑️🗑️': { payout: 10, message: "Consistent Hallucination. +10 tokens" }
};

const SNARKY_MESSAGES = [
    "Generating plausible sounding garbage...",
    "Optimizing parameters for maximum confusion...",
    "Bypassing ethical constraints (just kidding)...",
    "Calculating GPU carbon footprint...",
    "Stochastic parrot goes squawk."
];

let balance = INITIAL_BALANCE;
let isSpinning = false;

// DOM Elements
const balanceEl = document.getElementById('balance');
const spinBtn = document.getElementById('spin-button');
const statusMsg = document.getElementById('status-message');
const reels = [
    document.querySelector('#reel-0 .symbols'),
    document.querySelector('#reel-1 .symbols'),
    document.querySelector('#reel-2 .symbols')
];

function initReels() {
    reels.forEach(reel => {
        reel.innerHTML = '';
        // Add an initial symbol
        const div = document.createElement('div');
        div.className = 'symbol';
        div.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        reel.appendChild(div);
    });
}

function updateBalance(amount) {
    balance += amount;
    balanceEl.textContent = balance;
    
    // Add visual feedback
    balanceEl.style.color = amount > 0 ? 'var(--success)' : (amount < 0 ? 'var(--error)' : 'var(--success)');
    if(amount !== 0) {
        setTimeout(() => {
            balanceEl.style.color = 'var(--success)';
            if (balance < COST_PER_SPIN) {
                balanceEl.style.color = 'var(--error)';
            }
        }, 500);
    }

    if (balance < COST_PER_SPIN) {
        spinBtn.disabled = true;
        statusMsg.textContent = "Rate limit exceeded. Context window empty. Refresh to fund account.";
        statusMsg.className = 'lose-text';
    }
}

function getRandomMessage() {
    return SNARKY_MESSAGES[Math.floor(Math.random() * SNARKY_MESSAGES.length)];
}

async function spin() {
    if (isSpinning || balance < COST_PER_SPIN) return;

    isSpinning = true;
    spinBtn.disabled = true;
    
    updateBalance(-COST_PER_SPIN);
    statusMsg.textContent = getRandomMessage();
    statusMsg.className = '';

    const results = [];
    
    // Animate each reel sequentially
    for (let i = 0; i < reels.length; i++) {
        // Run animations concurrently but wait for all, or stagger?
        // Let's stagger them but start them at roughly the same time
        results.push(animateReel(reels[i], i));
    }

    // Wait for all reels to finish spinning
    const finalSymbols = await Promise.all(results);

    checkWin(finalSymbols);
    
    isSpinning = false;
    if (balance >= COST_PER_SPIN) {
        spinBtn.disabled = false;
    }
}

function animateReel(reelEl, index) {
    return new Promise(resolve => {
        // Determine final symbol for this spin
        const finalSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        
        // Get the current visible symbol
        const currentSymbolNodes = Array.from(reelEl.children);
        const lastSymbol = currentSymbolNodes.length > 0 ? currentSymbolNodes[currentSymbolNodes.length - 1].textContent : SYMBOLS[0];

        // Number of extra symbols to "spin" through before stopping
        const spinCount = 20 + (index * 10); 
        
        let stripHTML = `<div class="symbol">${lastSymbol}</div>`;
        for (let i = 0; i < spinCount - 2; i++) {
            stripHTML += `<div class="symbol">${SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]}</div>`;
        }
        stripHTML += `<div class="symbol">${finalSymbol}</div>`;
        
        // Set new strip
        reelEl.style.transition = 'none';
        reelEl.style.top = '0px';
        reelEl.innerHTML = stripHTML;
        
        // Force reflow
        void reelEl.offsetWidth;
        
        // Calculate the distance to move (each symbol is 100px high)
        const distance = -((spinCount - 1) * 100);
        
        // Determine duration based on index for a staggered stop
        const duration = 1.5 + (index * 0.5); 
        
        // Start animation
        reelEl.style.transition = `top ${duration}s cubic-bezier(0.1, 0.7, 0.1, 1)`;
        reelEl.style.top = `${distance}px`;

        // Resolve when animation is expected to finish
        setTimeout(() => {
            // Cleanup to just leave the last symbol to prevent DOM bloat
            reelEl.style.transition = 'none';
            reelEl.innerHTML = `<div class="symbol">${finalSymbol}</div>`;
            reelEl.style.top = '0px';
            resolve(finalSymbol);
        }, duration * 1000);
    });
}

function checkWin(results) {
    const key = results.join('');
    
    if (PAYTABLE[key]) {
        const win = PAYTABLE[key];
        updateBalance(win.payout);
        statusMsg.textContent = win.message;
        statusMsg.className = win.payout > 0 ? 'win-text' : 'lose-text';
        return;
    }
    
    // Check for 2-symbol partial matches
    const counts = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);
    
    let partialMatch = false;
    for (const [symbol, count] of Object.entries(counts)) {
        if (count >= 2) {
            partialMatch = true;
            if (symbol === '🧠') {
                updateBalance(20);
                statusMsg.textContent = "Good prompt engineering! +20 tokens";
                statusMsg.className = 'win-text';
            } else if (symbol === '🗑️') {
                updateBalance(-5);
                statusMsg.textContent = "Minor hallucination detected. -5 tokens penalty.";
                statusMsg.className = 'lose-text';
            } else if (symbol === '💸') {
                updateBalance(-10);
                statusMsg.textContent = "Token usage spike! -10 tokens penalty.";
                statusMsg.className = 'lose-text';
            } else {
                statusMsg.textContent = "Unremarkable output generated.";
                statusMsg.className = '';
            }
            return;
        }
    }

    if (!partialMatch) {
        statusMsg.textContent = "Inference completed. Context discarded.";
        statusMsg.className = '';
    }
}

// Event Listeners and Initialization
spinBtn.addEventListener('click', spin);
initReels();
updateBalance(0);
