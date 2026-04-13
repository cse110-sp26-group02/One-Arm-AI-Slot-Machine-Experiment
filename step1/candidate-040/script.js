const symbols = ['🤖', '🤡', '📉', '🧠', '🚫'];
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
        messageEl.innerText = "You are bankrupt, just like the AI's logic.";
        return;
    }

    tokens -= 10;
    tokensEl.innerText = tokens;
    messageEl.innerText = "Spinning...";

    const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    slots.forEach((slot, i) => slot.innerText = result[i]);

    if (result[0] === result[1] && result[1] === result[2]) {
        tokens += 50;
        tokensEl.innerText = tokens;
        messageEl.innerText = "Hallucinated a win! +50 tokens.";
    } else {
        messageEl.innerText = "The AI ate your tokens. Nothing happened.";
    }
});
