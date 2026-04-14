const symbols = ["Hallucination", "Data Leak", "Infinite Loop", "CPU Overheat", "Robot Overlord"];
let tokens = 100;
const cost = 10;

const tokenDisplay = document.getElementById('token-count');
const spinBtn = document.getElementById('spin-btn');
const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
const message = document.getElementById('message');

spinBtn.addEventListener('click', () => {
    if (tokens < cost) {
        message.innerText = "Error 402: Insufficient tokens to pay the AI overlord.";
        return;
    }

    tokens -= cost;
    tokenDisplay.innerText = tokens;
    message.innerText = "Processing input...";

    // Mock spinning
    const results = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    results.forEach((res, i) => reels[i].innerText = res);

    if (results[0] === results[1] && results[1] === results[2]) {
        const reward = 100;
        tokens += reward;
        message.innerText = `JACKPOT! The AI hallucinated a win! +${reward} tokens.`;
    } else {
        message.innerText = "AI result: Unintelligible noise. Try again.";
    }

    tokenDisplay.innerText = tokens;
});
