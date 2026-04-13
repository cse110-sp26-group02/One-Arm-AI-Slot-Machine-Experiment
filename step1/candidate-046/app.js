const symbols = ['🤖', '🤡', '📉', '💸', '💩'];
let tokens = 100;

const tokenDisplay = document.getElementById('token-count');
const spinBtn = document.getElementById('spin-btn');
const message = document.getElementById('message');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

function spin() {
    if (tokens <= 0) {
        message.innerText = "You're bankrupt, human. Even AI finds you inefficient.";
        return;
    }

    tokens -= 10;
    tokenDisplay.innerText = tokens;

    let result = [];
    for (let i = 0; i < 3; i++) {
        result.push(symbols[Math.floor(Math.random() * symbols.length)]);
        reels[i].innerText = result[i];
    }

    if (result[0] === result[1] && result[1] === result[2]) {
        tokens += 50;
        tokenDisplay.innerText = tokens;
        message.innerText = "Lucky fluke. You still don't understand the algorithm.";
    } else {
        message.innerText = "System prediction: You are going to lose. Try again.";
    }
}

spinBtn.addEventListener('click', spin);
