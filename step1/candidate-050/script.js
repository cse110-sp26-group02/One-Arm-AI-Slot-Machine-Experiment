const symbols = ['LLM', 'GPU', 'FAN', 'BUG', 'LOOP', 'HALLU'];
const tokenDisplay = document.getElementById('token-count');
const reelElements = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
const spinBtn = document.getElementById('spin-btn');
const msg = document.getElementById('message');

let tokens = 100;

spinBtn.addEventListener('click', () => {
    if (tokens < 10) {
        msg.textContent = "Out of compute! You're stuck in an infinite loop of poverty.";
        return;
    }

    tokens -= 10;
    tokenDisplay.textContent = tokens;
    
    const results = reelElements.map(reel => {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        reel.textContent = symbol;
        return symbol;
    });

    if (results[0] === results[1] && results[1] === results[2]) {
        tokens += 50;
        tokenDisplay.textContent = tokens;
        msg.textContent = `Aligned! You generated ${results[0]}! +50 tokens.`;
    } else {
        msg.textContent = "Your model failed to converge. Try again.";
    }
});