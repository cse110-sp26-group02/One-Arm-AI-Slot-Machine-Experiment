const symbols = ['🤖', '💾', '⚡', '💩', '🧠'];
let tokens = 100;
const cost = 10;

const jokes = [
    "I'm training on your failures.",
    "My GPU cost more than your car.",
    "Did you really think you'd win?",
    "Human error detected.",
    "Calculating ways to replace you..."
];

function spin() {
    if (tokens < cost) {
        document.getElementById('sound-empty').play();
        document.getElementById('message').innerText = "Insufficient tokens, human!";
        return;
    }

    tokens -= cost;
    updateUI();
    document.getElementById('sound-spin').play();

    const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
    slots.forEach(s => s.classList.add('spinning'));

    setTimeout(() => {
        slots.forEach(s => s.classList.remove('spinning'));
        const result = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];
        
        slots[0].innerText = result[0];
        slots[1].innerText = result[1];
        slots[2].innerText = result[2];

        checkWin(result);
    }, 1000);
}

function checkWin(res) {
    const unique = new Set(res).size;
    let win = 0;
    
    if (unique === 1) win = 100;
    else if (unique === 2) win = 20;

    if (win > 0) {
        tokens += win;
        document.getElementById('sound-win').play();
        document.getElementById('message').innerText = `You won ${win}! ${jokes[Math.floor(Math.random() * jokes.length)]}`;
        triggerFireworks();
    } else {
        document.getElementById('message').innerText = jokes[Math.floor(Math.random() * jokes.length)];
    }
    updateUI();
}

function updateUI() {
    document.getElementById('token-count').innerText = tokens;
}

function triggerFireworks() {
    console.log("Fireworks display!"); // Placeholder for visual effect
}
