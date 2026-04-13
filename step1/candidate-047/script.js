const symbols = ['🤖', '🔥', '💸', '🧠', '📉'];
let balance = 100;
let bet = 10;

const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
const balanceDisplay = document.getElementById('balance');
const statusDisplay = document.getElementById('status-ticker');
const spinBtn = document.getElementById('spin-btn');

spinBtn.addEventListener('click', () => {
    if (balance < bet) {
        statusDisplay.innerText = "Error: Compute budget exhausted. Beg for more tokens.";
        return;
    }

    balance -= bet;
    balanceDisplay.innerText = balance;
    
    const results = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    reels.forEach((reel, i) => reel.innerText = results[i]);

    if (results[0] === results[1] && results[1] === results[2]) {
        const reward = bet * 5;
        balance += reward;
        balanceDisplay.innerText = balance;
        statusDisplay.innerText = "Jackpot: AGI Achievement Unlocked! (Just Kidding, you just got more debt.)";
    } else {
        statusDisplay.innerText = "Token usage optimized: Nothing happened. Efficiency!";
    }
});
