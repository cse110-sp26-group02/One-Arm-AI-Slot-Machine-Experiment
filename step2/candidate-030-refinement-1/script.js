const symbols = ['🤖', '🧠', '💾', '📉', '⚡', '🚫'];
let balance = 1000;

const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const balanceDisplay = document.getElementById('balance-value');
const messageDisplay = document.getElementById('message');
const spinBtn = document.getElementById('spin-btn');

const messages = [
    "Training failed. Neural weights are corrupted.",
    "Overfitting again? That's not how generalization works.",
    "Data hallucinated successfully. Lost tokens.",
    "Optimization goal reached: Infinite Loss.",
    "Your model is bias towards bankruptcy.",
    "GPU burnt out. Please cool down.",
    "Successfully predicted market crashes. Oh wait, it was just your wallet."
];

spinBtn.addEventListener('click', () => {
    if (balance <= 0) {
        messageDisplay.innerText = "Model collapsed. Please reset environment.";
        return;
    }

    balance -= 10;
    updateBalance();

    const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    reels[0].innerText = result[0];
    reels[1].innerText = result[1];
    reels[2].innerText = result[2];

    if (result[0] === result[1] && result[1] === result[2]) {
        balance += 100;
        messageDisplay.innerText = "Wow! You actually found a real insight. Here are 100 tokens.";
    } else {
        messageDisplay.innerText = messages[Math.floor(Math.random() * messages.length)];
    }
    updateBalance();
});

function updateBalance() {
    balanceDisplay.innerText = balance;
}
