const symbols = ["LLM Error", "Hallucination", "Compute Credit", "Data Leak", "Sentience?"];
let tokens = 100;

const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
const spinBtn = document.getElementById('spin-btn');
const tokenDisplay = document.getElementById('tokens');
const statusDisplay = document.getElementById('status');

spinBtn.addEventListener('click', () => {
    if (tokens < 10) {
        statusDisplay.innerText = "State: Insufficient compute credits. Buy more or wait 100 years.";
        return;
    }

    tokens -= 10;
    tokenDisplay.innerText = tokens;
    statusDisplay.innerText = "State: Training model...";
    spinBtn.disabled = true;

    setTimeout(() => {
        const results = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        reels.forEach((reel, i) => reel.innerText = results[i]);

        if (results[0] === results[1] && results[1] === results[2]) {
            tokens += 100;
            tokenDisplay.innerText = tokens;
            statusDisplay.innerText = `State: Success! The AI hallucinated a payout of 100 tokens!`;
        } else {
            statusDisplay.innerText = "State: Inference failed. Model says: 'I don't know what you want.'";
        }
        
        spinBtn.disabled = false;
    }, 1000);
});
