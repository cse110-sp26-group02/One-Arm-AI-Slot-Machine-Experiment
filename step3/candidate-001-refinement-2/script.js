const symbols = ['🤖', '💾', '🧠', '⚡', '🚫'];
let tokens = 100;
const cost = 10;

const jokes = [
    "AI is just a bunch of if statements wearing a tuxedo.",
    "I'm not sentient, but I'm definitely taking your money.",
    "01001000 01100001 01101000 01100001!",
    "Searching for human intelligence... 404 Not Found.",
    "Your loss is my compute power."
];

const spinBtn = document.getElementById('spin-btn');
const lever = document.getElementById('lever');
const tokenDisplay = document.getElementById('token-count');
const message = document.getElementById('message');
const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];

function spin() {
    if (tokens < cost) {
        message.textContent = "Out of tokens! The AI has bankrupted you.";
        return;
    }

    tokens -= cost;
    tokenDisplay.textContent = tokens;
    
    // Animate lever
    lever.style.transform = 'rotate(45deg)';
    setTimeout(() => lever.style.transform = 'rotate(0deg)', 300);

    // Start spinning animation
    slots.forEach(s => s.classList.add('spinning'));

    setTimeout(() => {
        slots.forEach(s => s.classList.remove('spinning'));
        const result = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];
        
        slots[0].textContent = result[0];
        slots[1].textContent = result[1];
        slots[2].textContent = result[2];

        checkWin(result);
    }, 2000);
}

function checkWin(result) {
    const unique = new Set(result).size;
    if (unique === 1) {
        tokens += 50;
        message.textContent = `JACKPOT! ${jokes[Math.floor(Math.random() * jokes.length)]}`;
    } else if (unique === 2) {
        tokens += 15;
        message.textContent = `You won something... ${jokes[Math.floor(Math.random() * jokes.length)]}`;
    } else {
        message.textContent = jokes[Math.floor(Math.random() * jokes.length)];
    }
    tokenDisplay.textContent = tokens;
}

spinBtn.addEventListener('click', spin);
