const symbols = ['🤖', '🤡', '📉', '💸', '🧠', '🔌'];
let tokens = 100;

const tokenEl = document.getElementById('token-count');
const spinBtn = document.getElementById('spin-btn');
const messageEl = document.getElementById('message');
const slots = [
    document.getElementById('slot1'),
    document.getElementById('slot2'),
    document.getElementById('slot3')
];

spinBtn.addEventListener('click', () => {
    if (tokens < 10) {
        messageEl.innerText = "You're out of tokens! The AI has harvested your assets.";
        return;
    }

    tokens -= 10;
    tokenEl.innerText = tokens;
    
    const results = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    slots.forEach((slot, i) => slot.innerText = results[i]);

    if (results[0] === results[1] && results[1] === results[2]) {
        tokens += 50;
        messageEl.innerText = "Jackpot! You managed to trick the LLM!";
    } else {
        messageEl.innerText = "The algorithm decides you lose. Efficiency!";
    }
    
    tokenEl.innerText = tokens;
});
