const symbols = ['🤖', '🧠', '💸', '🔥', '💩'];
let tokens = 100;

const tokenCount = document.getElementById('token-count');
const spinButton = document.getElementById('spin-button');
const reels = document.querySelectorAll('.reel');
const message = document.getElementById('message');

function spin() {
    if (tokens < 10) {
        message.innerText = "Out of compute! Go get a job at a prompt-engineering firm.";
        return;
    }

    tokens -= 10;
    tokenCount.innerText = tokens;
    spinButton.disabled = true;

    const results = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    results.forEach((s, i) => reels[i].innerText = s);

    if (results[0] === results[1] && results[1] === results[2]) {
        tokens += 50;
        tokenCount.innerText = tokens;
        message.innerText = "Wow, your model actually converged! +50 Tokens.";
    } else {
        message.innerText = "Training failed. Overfitting detected.";
    }

    spinButton.disabled = false;
}

spinButton.addEventListener('click', spin);
