const symbols = ['🤖', '🧠', '📉', '💸', '🤡'];
let tokens = 100;

const tokenDisplay = document.getElementById('token-count');
const spinBtn = document.getElementById('spin-btn');
const message = document.getElementById('message');
const slots = [
    document.getElementById('slot1'),
    document.getElementById('slot2'),
    document.getElementById('slot3')
];

spinBtn.addEventListener('click', () => {
    if (tokens < 10) {
        message.innerText = "Insufficient tokens. Go back to training data.";
        return;
    }

    tokens -= 10;
    tokenDisplay.innerText = tokens;
    
    const results = slots.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    results.forEach((symbol, i) => slots[i].innerText = symbol);

    if (results[0] === results[1] && results[1] === results[2]) {
        tokens += 50;
        message.innerText = "Hallucination successful! +50 tokens.";
    } else {
        message.innerText = "Error 404: Logic not found. Try again.";
    }
    tokenDisplay.innerText = tokens;
});
