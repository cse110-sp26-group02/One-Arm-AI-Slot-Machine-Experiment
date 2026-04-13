const symbols = ['GPU', 'LLM', 'VC', 'Data', 'Hype', 'Exit'];
let tokens = 100;
const cost = 10;

const tokensEl = document.getElementById('tokens');
const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
const spinBtn = document.getElementById('spinBtn');
const messageEl = document.getElementById('message');

function spin() {
    if (tokens < cost) {
        messageEl.innerText = "Out of Compute! Need more funding.";
        return;
    }

    tokens -= cost;
    tokensEl.innerText = tokens;
    spinBtn.disabled = true;

    const results = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    reels.forEach((reel, i) => reel.innerText = results[i]);

    if (results[0] === results[1] && results[1] === results[2]) {
        tokens += 100;
        tokensEl.innerText = tokens;
        messageEl.innerText = "Seed Funding Secured! +100 Tokens";
    } else {
        messageEl.innerText = "Hallucinating... Try again.";
    }

    spinBtn.disabled = false;
}

spinBtn.addEventListener('click', spin);
