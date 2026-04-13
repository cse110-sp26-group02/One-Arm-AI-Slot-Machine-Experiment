const symbols = ['LLM', 'HAL', 'TOK', 'GPU', 'ERR'];
let tokens = 100;

const spinBtn = document.getElementById('spin-btn');
const tokenDisplay = document.getElementById('tokens');
const message = document.getElementById('message');
const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];

spinBtn.addEventListener('click', () => {
    if (tokens < 10) {
        message.innerText = "Insufficient tokens. AI cannot function on poverty.";
        return;
    }

    tokens -= 10;
    tokenDisplay.innerText = tokens;
    message.innerText = "Processing reality... simulating intelligence...";

    const results = reels.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    
    setTimeout(() => {
        reels.forEach((reel, i) => reel.innerText = results[i]);
        if (results[0] === results[1] && results[1] === results[2]) {
            tokens += 50;
            message.innerText = "Victory! You have hallucinated a winning state!";
        } else {
            message.innerText = "Error 404: Logic not found. Try again, human.";
        }
        tokenDisplay.innerText = tokens;
    }, 1000);
});
