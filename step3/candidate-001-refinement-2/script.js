const displaySymbols = ['🪙', '🧠', '🤖', '🖥️', '📉', '📚', '🤡'];
const balanceEl = document.getElementById('balance');
const slot1El = document.getElementById('slot1');
const slot2El = document.getElementById('slot2');
const slot3El = document.getElementById('slot3');
const spinBtn = document.getElementById('spin-btn');
const lever = document.getElementById('lever');
const messageEl = document.getElementById('message');

let balance = 10000;
const costPerSpin = 1000;
let isSpinning = false;

// Simplified Audio Context placeholders (using empty sounds for now as per constraints)
const sounds = {
    spin: new Audio(), 
    win: new Audio(),
    lose: new Audio()
};

function updateBalanceDisplay(target) {
    const start = balance;
    const duration = 500;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentBalance = Math.floor(start + (target - start) * progress);
        balanceEl.textContent = currentBalance.toLocaleString();
        if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const div = document.createElement('div');
        div.className = 'confetti';
        div.style.left = Math.random() * 100 + 'vw';
        div.style.animationDuration = (Math.random() * 2 + 1) + 's';
        container.appendChild(div);
    }
}

async function spin() {
    if (isSpinning) return;
    if (balance < costPerSpin) {
        messageEl.textContent = "Out of tokens! Mini-game locked.";
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    
    // Animate balance reduction
    updateBalanceDisplay(balance - costPerSpin);
    balance -= costPerSpin;

    const slots = [slot1El, slot2El, slot3El];
    slots.forEach(s => s.classList.add('spinning'));

    await new Promise(r => setTimeout(r, 1000));

    slots.forEach(s => s.classList.remove('spinning'));

    const s1 = displaySymbols[Math.floor(Math.random() * displaySymbols.length)];
    const s2 = displaySymbols[Math.floor(Math.random() * displaySymbols.length)];
    const s3 = displaySymbols[Math.floor(Math.random() * displaySymbols.length)];

    slot1El.textContent = s1;
    slot2El.textContent = s2;
    slot3El.textContent = s3;

    // Logic for win/loss
    if (s1 === s2 && s2 === s3) {
        const prize = 5000; 
        updateBalanceDisplay(balance + prize);
        balance += prize;
        messageEl.textContent = "JACKPOT! +5,000 Tokens";
        triggerConfetti();
    } else {
        messageEl.textContent = "Try again!";
    }

    isSpinning = false;
    spinBtn.disabled = false;
}

spinBtn.addEventListener('click', spin);
lever.addEventListener('click', spin);
