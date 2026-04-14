const SYMBOLS = ['🧠', '🤖', '📈', '💸', '🎰'];
const balanceEl = document.getElementById('balance');
const lever = document.getElementById('lever');
const statusMsg = document.getElementById('status-message');
const floatingNum = document.getElementById('floating-number');

let balance = 1000;

// Placeholder sounds (In a real app, use Audio objects)
const playSound = (type) => console.log(`Playing sound: ${type}`);

function updateBalanceDisplay(target) {
    let current = parseInt(balanceEl.textContent);
    const step = Math.sign(target - current) * Math.ceil(Math.abs(target - current) / 10);
    
    const interval = setInterval(() => {
        current += step;
        balanceEl.textContent = current;
        if ((step > 0 && current >= target) || (step < 0 && current <= target) || step === 0) {
            balanceEl.textContent = target;
            clearInterval(interval);
        }
    }, 50);
}

function spin() {
    if (balance < 10) {
        showMinigame();
        return;
    }
    
    balance -= 10;
    updateBalanceDisplay(balance);
    playSound('spin');
    
    statusMsg.textContent = "Spinning...";
    
    // Simulate spin logic
    setTimeout(() => {
        const results = [SYMBOLS[0], SYMBOLS[0], SYMBOLS[1]]; // Mock result
        resolveSpin(results);
    }, 1000);
}

function resolveSpin(results) {
    // Logic for win/loss
    const winnings = 50; 
    balance += winnings;
    updateBalanceDisplay(balance);
    
    statusMsg.textContent = "You Won!";
    showFloatingNumber(winnings);
    playSound('win');
}

function showFloatingNumber(amount) {
    floatingNum.textContent = `+${amount}`;
    floatingNum.style.opacity = 1;
    floatingNum.style.top = "200px";
    setTimeout(() => { floatingNum.style.opacity = 0; }, 1000);
}

function showMinigame() {
    document.getElementById('minigame-overlay').classList.remove('hidden');
    playSound('out-of-tokens');
}

lever.addEventListener('click', spin);
