const symbols = ['🤖', '💸', '🤡', '💾', '🔥', '📉'];
const messages = [
    "Hallucination achieved.",
    "GPU meltdown imminent.",
    "Wait, that's just a Python script.",
    "Infinite loop of mediocrity.",
    "Subscription fee applied.",
    "VC funding secured!"
];

let tokens = 100;

document.getElementById('spin-btn').addEventListener('click', () => {
    if (tokens < 10) {
        document.getElementById('message').innerText = "Out of tokens. Please mortgage your house.";
        return;
    }

    tokens -= 10;
    document.getElementById('token-count').innerText = tokens;

    const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    document.getElementById('reel1').innerText = result[0];
    document.getElementById('reel2').innerText = result[1];
    document.getElementById('reel3').innerText = result[2];

    if (result[0] === result[1] && result[1] === result[2]) {
        tokens += 50;
        document.getElementById('token-count').innerText = tokens;
        document.getElementById('message').innerText = "JACKPOT! A breakthrough in nothing.";
    } else {
        document.getElementById('message').innerText = messages[Math.floor(Math.random() * messages.length)];
    }
});
