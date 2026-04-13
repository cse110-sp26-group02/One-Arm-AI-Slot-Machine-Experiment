let tokens = 100;
const symbols = ['GPU', 'VC', 'HYPE', 'LLM', 'DATA'];
const btn = document.getElementById('spin-btn');

btn.addEventListener('click', () => {
    if (tokens < 10) {
        document.getElementById('message').innerText = "Insufficient compute budget. Go find more funding.";
        return;
    }
    
    tokens -= 10;
    updateTokens();
    
    const results = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];
    
    document.getElementById('reel1').innerText = results[0];
    document.getElementById('reel2').innerText = results[1];
    document.getElementById('reel3').innerText = results[2];
    
    if (results[0] === results[1] && results[1] === results[2]) {
        tokens += 50;
        document.getElementById('message').innerText = `Hallucinated a win: 3x ${results[0]}! +50 tokens.`;
    } else {
        document.getElementById('message').innerText = "Model failed to converge. Try again.";
    }
    updateTokens();
});

function updateTokens() {
    document.getElementById('tokens').innerText = `Tokens: ${tokens}`;
}
