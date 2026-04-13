const symbols = ['🤖', '💾', '🔌', '🧠', '📉'];
let tokens = 100;

const tokensEl = document.getElementById('tokens');
const messageEl = document.getElementById('message');
const spinBtn = document.getElementById('spin-btn');
const slots = [
    document.getElementById('slot1'),
    document.getElementById('slot2'),
    document.getElementById('slot3')
];

spinBtn.addEventListener('click', () => {
    if (tokens < 10) {
        messageEl.innerText = "Insufficient compute. Go get a real job.";
        return;
    }

    tokens -= 10;
    tokensEl.innerText = tokens;
    
    const results = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    results.forEach((s, i) => slots[i].innerText = s);

    if (results[0] === results[1] && results[1] === results[2]) {
        tokens += 50;
        tokensEl.innerText = tokens;
        messageEl.innerText = "Glitch in the matrix. You won 50 tokens.";
    } else {
        messageEl.innerText = "The AI rejected your input. Try again.";
    }
});
