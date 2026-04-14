const symbols = ['🤖', '💾', '🔌', '🧠', '🚫'];
const jokes = [
    "I'm sorry Dave, I can't let you win.",
    "Processing... still losing.",
    "My intelligence is artificial, but my greed is real.",
    "Loading... 99% probability of taking your tokens.",
    "Error 404: Luck not found.",
    "Calculating... beep boop, you lose."
];

let tokens = 100;
const cost = 5;

const lever = document.getElementById('lever');
const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
const tokenDisplay = document.getElementById('token-count');
const message = document.getElementById('message');

// Placeholder for AudioContext logic (requires user interaction)
let audioCtx;

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(type) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'spin') {
        osc.frequency.value = 200;
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    } else if (type === 'win') {
        osc.frequency.value = 600;
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    } else {
        osc.frequency.value = 100;
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    }
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

lever.addEventListener('click', () => {
    initAudio();
    if (tokens < cost) {
        message.innerText = "Insufficient tokens. Prepare for deletion.";
        playSound('out');
        return;
    }

    tokens -= cost;
    tokenDisplay.innerText = tokens;
    playSound('spin');

    slots.forEach(slot => slot.classList.add('spinning'));
    message.innerText = jokes[Math.floor(Math.random() * jokes.length)];

    setTimeout(() => {
        const result = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        slots.forEach((slot, i) => {
            slot.classList.remove('spinning');
            slot.innerText = result[i];
        });

        checkWin(result);
    }, 1000);
});

function triggerFireworks() {
    for (let i = 0; i < 20; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = Math.random() * 100 + 'vw';
        firework.style.top = Math.random() * 100 + 'vh';
        document.body.appendChild(firework);
        setTimeout(() => firework.remove(), 1000);
    }
}

function checkWin(result) {
    const aiCount = result.filter(s => s === '🤖').length;
    if (aiCount === 3) {
        tokens += 50;
        message.innerText = "Triple AI! The Overlord is pleased. +50 Tokens!";
        playSound('win');
        triggerFireworks();
    } else if (aiCount === 2) {
        tokens += 10;
        message.innerText = "Double AI! A minor calculation in your favor. +10 Tokens!";
        playSound('win');
    }
    tokenDisplay.innerText = tokens;
}
