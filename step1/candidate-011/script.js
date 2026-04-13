const symbolsList = ['🤖', '🧠', '💩', '📉', '💰', '🚀'];
const spinCost = 100;
let tokens = 10000;
let isSpinning = false;

const tokenCountEl = document.getElementById('token-count');
const spinButton = document.getElementById('spin-button');
const messageArea = document.getElementById('message-area');
const reels = [
    document.querySelector('#reel1 .symbols'),
    document.querySelector('#reel2 .symbols'),
    document.querySelector('#reel3 .symbols')
];

// Initialize reels
function initReels() {
    reels.forEach(reel => {
        reel.innerHTML = '';
        const sym = symbolsList[Math.floor(Math.random() * symbolsList.length)];
        const div = document.createElement('div');
        div.classList.add('symbol');
        div.textContent = sym;
        reel.appendChild(div);
        reel.style.top = '0px';
    });
}

function updateTokens() {
    tokenCountEl.textContent = tokens;
}

function getMessage(result) {
    if (result[0] === result[1] && result[1] === result[2]) {
        switch(result[0]) {
            case '🚀': return { msg: "AGI ACHIEVED! You won 10,000 tokens!", payout: 10000 };
            case '💰': return { msg: "VC Funding Secured! 5,000 tokens!", payout: 5000 };
            case '🧠': return { msg: "Galaxy Brain Output! 2,000 tokens!", payout: 2000 };
            case '🤖': return { msg: "Perfect API Response! 1,000 tokens!", payout: 1000 };
            case '💩': return { msg: "Massive Hallucination... but users loved it? 500 tokens!", payout: 500 };
            case '📉': return { msg: "Context Limit Reached! System Crash. Lose 500 tokens.", payout: -500 };
            default: return { msg: "Jackpot!", payout: 1000 };
        }
    } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
        return { msg: "Partial match. Found some semantic similarity. 50 tokens.", payout: 50 };
    } else {
        return { msg: "Garbage output. Tokens wasted.", payout: 0 };
    }
}

async function spin() {
    if (isSpinning) return;
    if (tokens < spinCost) {
        messageArea.innerHTML = "<span class='loss'>INSUFFICIENT FUNDS. PLEASE UPGRADE TO ENTERPRISE TIER.</span>";
        return;
    }

    isSpinning = true;
    tokens -= spinCost;
    updateTokens();
    spinButton.disabled = true;
    messageArea.innerHTML = "Generating response (Processing prompt...)";
    messageArea.className = 'message-area';

    const finalSymbols = [
        symbolsList[Math.floor(Math.random() * symbolsList.length)],
        symbolsList[Math.floor(Math.random() * symbolsList.length)],
        symbolsList[Math.floor(Math.random() * symbolsList.length)]
    ];

    const spinPromises = reels.map((reel, index) => {
        return new Promise(resolve => {
            reel.innerHTML = '';
            const stripLength = 20 + index * 10;
            for (let i = 0; i < stripLength; i++) {
                const sym = (i === stripLength - 1) ? finalSymbols[index] : symbolsList[Math.floor(Math.random() * symbolsList.length)];
                const div = document.createElement('div');
                div.classList.add('symbol');
                div.textContent = sym;
                reel.appendChild(div);
            }
           
            reel.style.transition = 'none';
            reel.style.top = '0px';

            void reel.offsetHeight;

            const symbolHeight = 120;
            const targetTop = -(stripLength - 1) * symbolHeight;
           
            const duration = 2 + index * 0.5;
            reel.style.transition = `top ${duration}s cubic-bezier(0.1, 0.7, 0.1, 1)`;
            reel.style.top = `${targetTop}px`;

            setTimeout(() => resolve(finalSymbols[index]), duration * 1000);
        });
    });

    const results = await Promise.all(spinPromises);
   
    const outcome = getMessage(results);
    tokens += outcome.payout;
    updateTokens();

    if (outcome.payout > 0) {
        messageArea.innerHTML = `<span class='win'>${outcome.msg}</span>`;
    } else if (outcome.payout < 0) {
        messageArea.innerHTML = `<span class='loss'>${outcome.msg}</span>`;
    } else {
        messageArea.innerHTML = `<span class='loss'>${outcome.msg}</span>`;
    }

    isSpinning = false;
    spinButton.disabled = false;
}

spinButton.addEventListener('click', spin);

initReels();
updateTokens();
