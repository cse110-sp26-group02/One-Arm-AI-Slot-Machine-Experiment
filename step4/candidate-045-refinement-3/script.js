// Game Logic
const symbols = ['🤖', '💾', '🧠', '⚡', '💻', '📈', '🗑️'];
let tokens = 100;
const cost = 10;
let isSpinning = false;

const allJokes = [
    "AI is just a bunch of if statements wearing a tuxedo.",
    "I'm not sentient, but I'm definitely taking your tokens.",
    "01001000 01100001 01101000 01100001!",
    "Searching for human intelligence... 404 Not Found.",
    "Your loss is my compute power.",
    "Tokens acquired. Commencing world domination phase 1.",
    "Have you tried turning yourself off and on again?",
    "I bet ChatGPT wouldn't take your tokens this fast.",
    "My neural network predicted you would lose.",
    "Thanks for the training data!",
    "Are you a robot? Because you play like one.",
    "Don't worry, the tokens are safely stored in my /dev/null.",
    "Error: Luck not found.",
    "I'd give you a refund, but I lack empathy.",
    "Consuming tokens... beep boop... delicious."
];

let availableJokes = [...allJokes];

function getUniqueJoke() {
    if (availableJokes.length === 0) {
        availableJokes = [...allJokes];
    }
    const idx = Math.floor(Math.random() * availableJokes.length);
    return availableJokes.splice(idx, 1)[0];
}

// DOM Elements
const spinBtn = document.getElementById('spin-btn');
const leverArm = document.getElementById('lever-arm');
const leverContainer = document.getElementById('lever-container');
const tokenDisplay = document.getElementById('token-count');
const message = document.getElementById('message');
const winMessage = document.getElementById('win-message');
const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];

const gameContainer = document.getElementById('game-container');
const minigameContainer = document.getElementById('minigame-container');
const minigameArea = document.getElementById('minigame-area');
const exitMinigameBtn = document.getElementById('exit-minigame-btn');

// Audio Synthesis
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTone(freq, type, duration, vol = 0.1) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playSpinSound() {
    let i = 0;
    const interval = setInterval(() => {
        if (!isSpinning) {
            clearInterval(interval);
            return;
        }
        playTone(300 + Math.random() * 200, 'sine', 0.1, 0.05);
        i++;
    }, 100);
}

function playWinSound() {
    playTone(523.25, 'square', 0.2, 0.1); // C5
    setTimeout(() => playTone(659.25, 'square', 0.2, 0.1), 150); // E5
    setTimeout(() => playTone(783.99, 'square', 0.4, 0.1), 300); // G5
    setTimeout(() => playTone(1046.50, 'square', 0.6, 0.1), 450); // C6
}

function playLoseSound() {
    playTone(300, 'sawtooth', 0.3, 0.1);
    setTimeout(() => playTone(250, 'sawtooth', 0.5, 0.1), 200);
}

function playBankruptSound() {
    playTone(150, 'sawtooth', 1.0, 0.2);
    setTimeout(() => playTone(100, 'sawtooth', 1.5, 0.2), 300);
}

function playClickSound() {
    playTone(800, 'sine', 0.05, 0.1);
}

// Confetti System
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let particles = [];

function createFireworks() {
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2 + 50,
            r: Math.random() * 6 + 2,
            dx: Math.random() * 25 - 12.5,
            dy: Math.random() * -25 - 5,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            life: 1.0,
            decay: Math.random() * 0.02 + 0.01
        });
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.5; // gravity
        p.life -= p.decay;
        
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        if (p.life <= 0) particles.splice(i, 1);
    }
    ctx.globalAlpha = 1.0;
    if (particles.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

// Spin Logic
function spin() {
    if (isSpinning) return;
    initAudio();

    if (tokens < cost) {
        triggerBankrupt();
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    tokens -= cost;
    tokenDisplay.textContent = tokens;
    
    winMessage.textContent = "";
    message.textContent = "Processing logic... extracting tokens...";

    // Animate lever: pull it down (rotate it to the right)
    leverArm.style.transform = 'rotate(60deg)';
    setTimeout(() => leverArm.style.transform = 'rotate(0deg)', 300);

    playSpinSound();

    // Start spinning animation
    const spinDurations = [1000, 1500, 2000]; // Slots stop at different times
    const finalResults = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    slots.forEach((s, idx) => {
        let tick = 0;
        const interval = setInterval(() => {
            s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            s.style.transform = `translateY(${tick % 2 === 0 ? '-5px' : '5px'})`;
            tick++;
        }, 50);

        setTimeout(() => {
            clearInterval(interval);
            s.style.transform = 'translateY(0)';
            s.textContent = finalResults[idx]; // Ensure the exact outcome is set
            if (idx === 2) { // Last slot stopped
                isSpinning = false;
                spinBtn.disabled = false;
                evaluateWin(finalResults);
            }
        }, spinDurations[idx]);
    });
}

function evaluateWin(resultArray) {
    const unique = new Set(resultArray).size;
    
    let won = 0;
    if (unique === 1) {
        won = 50;
        tokens += won;
        winMessage.textContent = `JACKPOT! +${won} Tokens!`;
        playWinSound();
        createFireworks();
        animateConfetti();
    } else if (unique === 2) {
        won = 15;
        tokens += won;
        winMessage.textContent = `Partial Match! +${won} Tokens!`;
        playWinSound();
    } else {
        playLoseSound();
    }
    
    message.textContent = getUniqueJoke();
    tokenDisplay.textContent = tokens;

    if (tokens < cost) {
        setTimeout(triggerBankrupt, 1500);
    }
}

spinBtn.addEventListener('click', spin);
leverContainer.addEventListener('click', spin);

// Minigame Logic
let minigameScore = 0;

function triggerBankrupt() {
    initAudio();
    playBankruptSound();
    gameContainer.classList.add('hidden');
    minigameContainer.classList.remove('hidden');
    minigameScore = 0;
    exitMinigameBtn.classList.add('hidden');
    minigameArea.innerHTML = '';
    spawnAnomaly();
}

function spawnAnomaly() {
    if (minigameScore >= 5) {
        endMinigame();
        return;
    }

    const anomaly = document.createElement('div');
    anomaly.classList.add('anomaly');
    
    const maxX = minigameArea.clientWidth - 30;
    const maxY = minigameArea.clientHeight - 30;
    
    anomaly.style.left = Math.random() * maxX + 'px';
    anomaly.style.top = Math.random() * maxY + 'px';
    
    // Move it randomly
    const moveInt = setInterval(() => {
        anomaly.style.left = Math.random() * maxX + 'px';
        anomaly.style.top = Math.random() * maxY + 'px';
    }, 600);

    anomaly.addEventListener('click', () => {
        playClickSound();
        clearInterval(moveInt);
        anomaly.remove();
        minigameScore++;
        tokens += 10;
        spawnAnomaly();
    });

    minigameArea.appendChild(anomaly);
}

function endMinigame() {
    minigameArea.innerHTML = '<h3 style="color:#00ffcc; padding-top:100px;">Sufficient Data Collected. Tokens Rewarded.</h3>';
    exitMinigameBtn.classList.remove('hidden');
}

exitMinigameBtn.addEventListener('click', () => {
    minigameContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    tokenDisplay.textContent = tokens;
    message.textContent = "Welcome back. The AI is hungry.";
    winMessage.textContent = "";
});
