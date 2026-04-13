const symbols = ['🤖', '🧠', '📉', '🔥', '⚠️', '💸'];
let tokens = 100;

const spinBtn = document.getElementById('spin-btn');
const balanceDisplay = document.getElementById('balance');
const messageDisplay = document.getElementById('message');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

spinBtn.addEventListener('click', () => {
    if (tokens < 10) {
        messageDisplay.innerText = "Insufficient tokens. Please wait for the next funding round.";
        return;
    }

    tokens -= 10;
    balanceDisplay.innerText = `Tokens: ${tokens}`;

    const results = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    reels.forEach((reel, i) => reel.innerText = results[i]);

    if (results[0] === results[1] && results[1] === results[2]) {
        tokens += 50;
        messageDisplay.innerText = "A rare moment of coherence! +50 tokens.";
    } else {
        messageDisplay.innerText = "Hallucination detected. Try again, human.";
    }
    balanceDisplay.innerText = `Tokens: ${tokens}`;
});
