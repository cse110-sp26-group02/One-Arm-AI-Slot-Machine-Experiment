const symbols = ['🤖', '🧠', '💸', '🤡', '💾'];
let tokens = 100;

const tokensEl = document.getElementById('tokens');
const spinBtn = document.getElementById('spin-btn');
const messageEl = document.getElementById('message');
const slots = [
    document.getElementById('slot1'),
    document.getElementById('slot2'),
    document.getElementById('slot3')
];

spinBtn.addEventListener('click', () => {
    if (tokens < 10) {
        messageEl.innerText = "Insufficient compute. Go work for more tokens.";
        return;
    }

    tokens -= 10;
    tokensEl.innerText = tokens;
    messageEl.innerText = "Computing probability of failure...";
    spinBtn.disabled = true;

    // Simulate "thinking"
    setTimeout(() => {
        const results = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        results.forEach((s, i) => slots[i].innerText = s);

        if (results[0] === results[1] && results[1] === results[2]) {
            tokens += 50;
            tokensEl.innerText = tokens;
            messageEl.innerText = "Hallucination Detected! You won 50 tokens!";
        } else {
            messageEl.innerText = "The model has no opinion on your success.";
        }
        spinBtn.disabled = false;
    }, 1000);
});
