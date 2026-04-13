const tokensDisplay = document.getElementById('tokens');
const spinBtn = document.getElementById('spin-btn');
const message = document.getElementById('message');
const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];

const SYMBOLS = ['🤖', '🧠', '💸', '❌', '📉'];
let tokens = 100;

function spin() {
    if (tokens < 10) {
        message.innerText = "Insufficient tokens. Return to the prompt mines.";
        return;
    }
    tokens -= 10;
    tokensDisplay.innerText = tokens;
    
    const results = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];
    
    slots.forEach((el, i) => el.innerText = results[i]);
    
    if (results[0] === results[1] && results[1] === results[2]) {
        tokens += 50;
        message.innerText = "You cheated the algorithm! +50 tokens.";
    } else {
        message.innerText = "The AI decided you lose. Everything is fine.";
    }
    tokensDisplay.innerText = tokens;
}

spinBtn.addEventListener('click', spin);
